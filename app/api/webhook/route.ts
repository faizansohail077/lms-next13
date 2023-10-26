import Stripe from 'stripe'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function Post(req: NextRequest) {
    const body = await req.text()
    const signature = headers().get("Stripe_Signature") as string
    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (error) {
        console.log(error, 'error webhook')
        return NextResponse.json({ msg: "Webhook Error" }, { status: 500 })
    }
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session?.metadata?.userId
    const courseId = session?.metadata?.courseId

    if (event.type === "checkout.session.completed") {
        if (!userId || !courseId) {
            return NextResponse.json({ msg: "another webhook error" }, { status: 400 })
        }
        await db.purchase.create({
            data: {
                courseId,
                userId
            }
        })
    } else {
        return NextResponse.json({ msg: "Webhook error unhandle event type" }, { status: 200 })
    }

    return NextResponse.json({ msg: null }, { status: 200 })
}