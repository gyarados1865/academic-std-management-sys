import prisma from './src/prisma/prismaClient.js';

const currentRunEmails = [
  'admin-student-1785329659289@example.com',
  'student-role-1785329659289@example.com',
  'student-1785329663846-j42g3y@example.com',
  'student-1785329665455-rnkk3n@example.com',
  'student-1785329667891-1394s5@example.com',
  'student-1785329672593-pa9qi4@example.com',
  'updated-1785329674175@example.com',
  'student-1785329676232-0e87hz@example.com',
  'admin-teacher-1785329706682@example.com',
  'student-teacher-1785329706682@example.com',
  'teacher-1785329711638-hvgkc4@example.com',
  'teacher-1785329713376-6eh8if@example.com',
  'teacher-1785329716613-abh3x9@example.com',
  'teacher-1785329719282-26phom@example.com',
  'updated-teacher-1785329720500@example.com',
  'teacher-1785329723096-pkv8mh@example.com',
];

async function check() {
  const users = await prisma.user.findMany({
    where: {
      email: {
        in: currentRunEmails,
      },
    },
  });

  console.log('currentRunUsers', users.length, JSON.stringify(users.map(u => ({ id: u.id, name: u.name, email: u.email })), null, 2));

  await prisma.$disconnect();
}

check().catch((err) => {
  console.error(err);
  process.exit(1);
});
