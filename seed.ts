import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const user1 = await prisma.user.upsert({
    where: { email: 'demo@habitloop.com' },
    update: {},
    create: {
      email: 'demo@habitloop.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice Johnson',
      password: hashedPassword,
    },
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob Smith',
      password: hashedPassword,
    },
  })

  console.log('✅ Created demo users')

  // Create demo habits
  const habit1 = await prisma.habit.create({
    data: {
      userId: user1.id,
      title: 'Morning Meditation',
      description: '10 minutes of mindfulness',
      frequency: 'DAILY',
      reminderTime: '07:00',
      category: 'Wellness',
    },
  })

  const habit2 = await prisma.habit.create({
    data: {
      userId: user1.id,
      title: 'Drink 2L Water',
      frequency: 'DAILY',
      category: 'Health',
    },
  })

  const habit3 = await prisma.habit.create({
    data: {
      userId: user2.id,
      title: 'Read for 30 minutes',
      frequency: 'DAILY',
      category: 'Learning',
    },
  })

  console.log('✅ Created demo habits')

  // Create a demo group
  const group = await prisma.group.create({
    data: {
      name: 'Morning Routine Masters',
      description: 'Building better morning habits together',
      type: 'PUBLIC',
      maxMembers: 6,
      members: {
        create: [
          { userId: user1.id, role: 'ADMIN' },
          { userId: user2.id, role: 'MEMBER' },
          { userId: user3.id, role: 'MEMBER' },
        ],
      },
    },
  })

  console.log('✅ Created demo group')

  // Add habits to group
  await prisma.groupHabit.createMany({
    data: [
      { groupId: group.id, habitId: habit1.id },
      { groupId: group.id, habitId: habit3.id },
    ],
  })

  console.log('✅ Added habits to group')

  // Create some check-ins for the past week
  const today = new Date()
  const checkIns = []

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    // User 1 checks in most days
    if (i < 5) {
      checkIns.push({
        habitId: habit1.id,
        userId: user1.id,
        date,
        completed: true,
      })
      checkIns.push({
        habitId: habit2.id,
        userId: user1.id,
        date,
        completed: true,
      })
    }

    // User 2 checks in regularly
    if (i < 6) {
      checkIns.push({
        habitId: habit3.id,
        userId: user2.id,
        date,
        completed: true,
      })
    }
  }

  await prisma.habitCheckin.createMany({
    data: checkIns,
    skipDuplicates: true,
  })

  console.log('✅ Created demo check-ins')

  console.log('\n🎉 Seeding complete!')
  console.log('\nDemo accounts:')
  console.log('Email: demo@habitloop.com')
  console.log('Email: alice@example.com')
  console.log('Email: bob@example.com')
  console.log('Password (all): password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
