import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const banks = [
    {
      name: 'Royal Bank of Canada (RBC)',
      usernamePlaceholder: 'Enter your Client ID',
      imgUrl: 'https://www.rbcroyalbank.com/dvl/v1.0/assets/images/logos/rbc-logo-shield.svg',
    },
    {
      name: 'Toronto-Dominion Bank (TD Bank)',
      usernamePlaceholder: 'Enter your Username',
      imgUrl: 'https://www.td.com/content/dam/tdct/images/personal-banking/td-logo-en.png',
    },
    {
      name: 'Bank of Nova Scotia (Scotiabank)',
      usernamePlaceholder: 'Enter your Username',
      imgUrl: 'https://www.scotiabank.com/content/dam/scotiabank/images/logos/2019/scotiabank-logo-red-mobile.svg',
    },
    {
      name: 'Bank of Montreal (BMO)',
      usernamePlaceholder: 'Enter your BMO Debit Card Number',
      imgUrl: 'https://www.bmo.com/dist/images/logos/bmo-blue-on-transparent-pride.svg',
    },
    {
      name: 'Canadian Imperial Bank of Commerce (CIBC)',
      usernamePlaceholder: 'Enter your Card Number or Username',
      imgUrl: 'https://www.cibc.com/content/dam/global-assets/logos/cibc-logos/no-tagline/cibc-logo-colour-142x36.svg',
    },
    {
      name: 'National Bank of Canada',
      usernamePlaceholder: 'Enter your Access Code',
      imgUrl: 'https://www.nbc.ca/content/dam/bnc/particuliers/logo/logo-nbc-lgbtq.svg',
    },
    {
      name: 'HSBC Bank Canada',
      usernamePlaceholder: 'Enter your Username',
      imgUrl: 'https://www.hsbc.com/-/files/hsbc/header/hsbc-logo-200x25.svg?h=25&la=en-GB&hash=EFB19274CD17649AE659D3351B595180',
    },
  ];

  for (const bank of banks) {
    await prisma.banks.upsert({
      where: { name: bank.name },
      update: {},
      create: {
          
        name: bank.name,
        usernamePlaceholder: bank.usernamePlaceholder,
        imgUrl: bank.imgUrl,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
