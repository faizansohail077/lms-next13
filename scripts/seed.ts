const {PrismaClient} = require("@prisma/client")
const database = new PrismaClient()

async function main() {
    try {
        await database.category.createMany({
            data: [
                { name: "Computer Science" },
                { name: "Music" },
                { name: "Fitness" },
                { name: "Accountind" },
                { name: "Photography" },
                { name: "Filming" },
                { name: "Engineering" },
            ]
        })
        console.log('Success Seeding')
    } catch (error) {
        console.log(error, 'seed db error')
    } finally {
        await database.$disconnect()
    }
}

main()