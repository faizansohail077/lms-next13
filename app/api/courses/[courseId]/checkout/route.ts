import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest, { params }: { params: { courseId: string } }) {
    try {
        const { courseId } = params
        const user = await currentUser()
        if (!user || !user?.id || !user.emailAddresses?.[0]?.emailAddress) {
            return NextResponse.json({ msg: "Unauthorized" }, { status: 401 })
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                isPublished: true
            }
        })

        const purchased = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId
                }
            }
        })

        if (purchased) {
            return NextResponse.json({ msg: "Already Purchased" }, { status: 400 })
        }
        if (!course) {
            return NextResponse.json({ msg: "Not Found" }, { status: 404 })
        }

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: course.title,
                        description: course.description!
                    },
                    unit_amount: Math.round(course?.price! * 100)
                }
            }
        ]
        let stripe_customer = await db.stripeCustomer.findUnique({
            where: {
                userId: user?.id
            },
            select: {
                stripeCustomerId: true
            }
        })
        if (!stripe_customer) {
            const customer = await stripe.customers.create({
                email: user?.emailAddresses?.[0].emailAddress
            })
            stripe_customer = await db.stripeCustomer.create({
                data: {
                    userId: user?.id,
                    stripeCustomerId: customer.id
                }
            })
        }

        const session = await stripe.checkout.sessions.create({
            customer: stripe_customer.stripeCustomerId,
            line_items,
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
            metadata: {
                courseId: course.id,
                userId: user.id
            }
        })
        return NextResponse.json({ url: session.url })

    } catch (error) {
        console.log(error, 'course checkout error')
        return NextResponse.json({ msg: "Something Went Wrong checkout" })
    }

}