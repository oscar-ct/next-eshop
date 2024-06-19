const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

async function main() {
    await prisma.user.create({
        data: {
            email: "admin@email.com",
            name: "Admin",
            password: "$2b$10$YjvP9PNPgUksrHUHBabDneO1L2u8MMHQYwUDa3hVAk5WZGy.hhPG.",

        }
    });
    await prisma.address.createMany({
        data: [{
            name: "Admin",
            address: "600 Navarro St #300",
            city: "San Antonio",
            state: "Texas",
            postalCode: "78205",
            country: "United States",
            userId: "e143e09a-7f41-45cf-bec3-50b28c21715b"
        },
        {
            name: "Oscar Castro",
            address: "12814 Falcons Nest",
            city: "San Antonio",
            state: "Texas",
            postalCode: "78233",
            country: "United States",
            userId: "e143e09a-7f41-45cf-bec3-50b28c21715b"
        }]
    });
    await prisma.product.create({
        data: {
            userId: "e143e09a-7f41-45cf-bec3-50b28c21715b",
            name: "IRIS USA WOOZOO Oscillating Fan, Vortex Fan, Remote Equipped 4-in-1 Fan w/ Timer/ Multi Oscillation/ Air Circulator/ 5 Speed Settings, 82ft Max Air Distance, AC Motor, Medium, White",
            brand: "IRIS USA, Inc.",
            model: "PCF-SC15",
            color: "White",
            category: "Electronics",
            description: "Modes: Set your fan with the 6 vertical manual tilt settings, then enjoy the rest of the comfort from the palm of your hands. Choose from 5 speed settings, starting with the whisper quiet breeze to a strong gust to blow away the heat. Share the breeze with those around you by oscillating the fan left and right.",
            price: 7753,
            countInStock: 5,
        }
    })
    await prisma.image.create({
        data: {
            url: "https://cdn.filestackcontent.com/Vir5Ms1FSkCpn1OtVyIG",
            handle: "Vir5Ms1FSkCpn1OtVyIG",
            productId: "17422467-a2d7-432a-b561-7b6adea58f4b",
        }
    })
    await prisma.review.create({
        data: {
            name: "Admin",
            title: "Great fan!",
            comment: "Strong and compact",
            rating: 4,
            userId: "e143e09a-7f41-45cf-bec3-50b28c21715b",
            productId: "17422467-a2d7-432a-b561-7b6adea58f4b",
        }
    })
    await prisma.order.create({
        data: {
            userId: "e143e09a-7f41-45cf-bec3-50b28c21715b",
            name: "Courtney Hopkins",
            address: "16505 Lookout Hollow",
            city: "Selma",
            state: "Texas",
            postalCode: "78244",
            country: "United States",
            itemsPrice: 938,
            taxPrice: 77,
            shippingPrice: 0,
            totalPrice: 1015,
            paymentMethod: "Stripe / Credit Card",
            isPaid: true,
            freeShipping: false,
            paidAmount: 1015,
            paidAt: new Date("2024-03-14 06:22:00"),
            orderItems: {
                create : [
                    {
                        productId: "17422467-a2d7-432a-b561-7b6adea58f4b",
                        imageUrls: ["https://cdn.filestackcontent.com/SPYvdrYZQpuAI4yGofb5", "https://cdn.filestackcontent.com/3wfx2yIQT2eYSqDZlV9h"],
                        name: "Pokémon - Trading Card Game: Scarlet & Violet —Obsidian Flames Sleeved Booster - Styles May Vary",
                        brand: "Pokémon",
                        quantity: 2,
                        isPaid: true,
                        price: 469,
                    },
                ]
            },
            orderPayment: {
                create: {
                    transaction_id: "7LM23509738994053",
                    status: "COMPLETED",
                    update_time: "2023-08-24T03:05:07Z",
                    email_address: "cm.berry@yahoo.com"
                }
            }
        }
    })
}

main().catch((e) => {
    console.log(e)
}).finally(async () => {
    await prisma.$disconnect()
})
