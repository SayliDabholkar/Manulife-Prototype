import { CourseModule, UserBadge } from './types';

export const BADGES: UserBadge[] = [
  {
    id: 'badge-foundations',
    title: 'Tax Shield Novice',
    description: 'Mastered the core concepts of RRSPs, TFSAs, and how Canada taxes income.',
    icon: '🛡️',
  },
  {
    id: 'badge-pension',
    title: 'Free Money Magnet',
    description: 'Completed the Group Pension and matching module and maxed out your matching.',
    icon: '💰',
  },
  {
    id: 'badge-tfsa',
    title: 'TFSA Alchemist',
    description: 'Mastered TFSA cumulative contribution room, penalties, and qualified investments.',
    icon: '⚡',
  },
  {
    id: 'badge-rrsp',
    title: 'Future Proof Specialist',
    description: 'Understood tax deduction math, Home Buyers\' Plan rules, and retirement deferrals.',
    icon: '🚀',
  },
  {
    id: 'badge-compounding',
    title: 'Wealth Architect',
    description: 'Finished the compound interest simulation and strategic asset allocation module.',
    icon: '🎓',
  },
  {
    id: 'badge-coach',
    title: 'AI Advisory Seeker',
    description: 'Consulted the AI Financial Coach to get a personalized Canadian wealth roadmap.',
    icon: '💬',
  },
];

export const COURSE_MODULES: CourseModule[] = [
  {
    id: 'mod-1',
    title: '1. Wealth Foundations: TFSA vs. RRSP',
    shortDescription: 'Unpack the fundamental differences between tax-sheltered accounts in Canada.',
    category: 'foundations',
    xpReward: 150,
    badgeId: 'badge-foundations',
    lessons: [
      {
        id: 'mod-1-les-1',
        title: 'Understanding Taxes & Tax Shelters',
        content: `In Canada, any money you earn in a standard savings or investment account is subject to income tax. If you make capital gains, dividends, or interest, the government takes a cut. 
        
Fortunately, the Canadian government created **Tax-Sheltered Accounts** to encourage citizens to save. The two most powerful pillars of Canadian personal finance are:
1. **TFSA (Tax-Free Savings Account)**
2. **RRSP (Registered Retirement Savings Plan)**

Understanding when to use which is the absolute foundation of your financial freedom.`,
        bullets: [
          'In standard accounts, growth is taxed every single year.',
          'Tax shelters allow your investments to grow completely tax-free or tax-deferred.',
          'Choosing the right account can save you tens of thousands of dollars in taxes over your lifetime.'
        ]
      },
      {
        id: 'mod-1-les-2',
        title: 'TFSA: The Tax-Free Secret Weapon',
        content: `The **Tax-Free Savings Account (TFSA)** was introduced in 2009. Don't let the word "Savings" fool you—it is actually an **investment** account. 

Here is the key mechanic of a TFSA:
* **After-Tax Contributions:** You contribute money that you have already paid tax on (your net paycheck).
* **Tax-Free Growth:** Any investment growth (interest, capital gains, stock dividends) inside the TFSA is **100% tax-free**.
* **Tax-Free Withdrawals:** You can withdraw money from your TFSA *at any time* for *any reason* without paying a single cent of tax.
* **Restored Room:** If you withdraw $5,000 this year, that $5,000 of contribution room is **added back** to your limit on January 1st of the next calendar year!`,
        bullets: [
          'Contributions are made with AFTER-TAX dollars.',
          'Growth and withdrawals are 100% tax-free, forever.',
          'Withdrawn amounts are restored as contribution room the following calendar year.'
        ]
      },
      {
        id: 'mod-1-les-3',
        title: 'RRSP: The Retirement Tax Deferral Engine',
        content: `The **Registered Retirement Savings Plan (RRSP)** is designed specifically to help Canadians save for retirement while lowering their current tax bill.

Here is the key mechanic of an RRSP:
* **Pre-Tax Contributions (Tax Deduction):** When you contribute to an RRSP, that amount is deducted from your taxable income for that year. If you make $80,000 and contribute $10,000 to an RRSP, you only pay income tax on $70,000. This triggers a sweet **tax refund** from the CRA!
* **Tax-Deferred Growth:** Investments inside the RRSP grow tax-free.
* **Taxed Withdrawals:** When you retire and withdraw money from your RRSP, that money is treated as taxable income. The strategy is that your tax bracket in retirement will be much lower than it is during your peak earning years, resulting in a net tax savings.`,
        bullets: [
          'Contributions trigger a tax deduction, reducing your current year taxable income.',
          'Growth is tax-sheltered until withdrawal.',
          'Withdrawals are taxed as regular income, ideally at a lower retirement tax bracket.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q1-1',
        question: 'What is the main tax benefit of contributing to an RRSP?',
        options: [
          'It allows you to withdraw money completely tax-free at any age.',
          'It provides an immediate tax deduction, reducing your current taxable income and often triggering a refund.',
          'It eliminates Canadian sales tax (GST/HST) on your daily purchases.',
          'It gives you free government matching grants automatically.'
        ],
        correctAnswerIndex: 1,
        explanation: 'RRSP contributions provide a tax deduction which directly lowers your taxable income for the year, saving you money at your current marginal tax rate and often leading to a tax refund!'
      },
      {
        id: 'q1-2',
        question: 'If you withdraw $3,000 from your TFSA today to pay for emergency car repairs, when do you get that contribution room back?',
        options: [
          'Never, once withdrawn, that contribution room is lost forever.',
          'Immediately, you can re-contribute it this afternoon.',
          'On January 1st of the next calendar year.',
          'Only when you turn 65 years old.'
        ],
        correctAnswerIndex: 2,
        explanation: 'Any amount withdrawn from a TFSA is added back to your contribution room on January 1st of the following calendar year, preventing you from permanently losing your valuable tax-free room.'
      },
      {
        id: 'q1-3',
        question: 'Which of the following is true regarding TFSA contributions?',
        options: [
          'They are made with pre-tax dollars and reduce your current tax bill.',
          'They can only be used to hold cash savings accounts, not stocks or ETFs.',
          'They are made with after-tax dollars, and withdrawals are 100% tax-free.',
          'They must be locked in until you retire.'
        ],
        correctAnswerIndex: 2,
        explanation: 'TFSA contributions are made with after-tax money (income you have already paid tax on). In return, all investment growth and subsequent withdrawals are completely tax-free.'
      }
    ]
  },
  {
    id: 'mod-2',
    title: '2. The Golden Ticket: Group Pensions & Matching',
    shortDescription: 'Understand how group pension plans work and how to secure "free money" from your employer.',
    category: 'pension',
    xpReward: 200,
    badgeId: 'badge-pension',
    lessons: [
      {
        id: 'mod-2-les-1',
        title: 'Demystifying Group Pension Plans',
        content: `Many Canadian employers offer **Group Pension Plans** or **Group RRSPs** as part of their employee benefits packages. It is one of the most powerful, yet frequently neglected tools for wealth building.

There are two primary types of pension plans in Canada:
1. **Defined Benefit (DB) Plan:** Your employer promises a guaranteed, pre-calculated payout in retirement based on your salary and years of service. (Often found in government or public sector jobs).
2. **Defined Contribution (DC) Plan:** You and your employer contribute money into a personal retirement account. The final retirement nest egg depends entirely on how much was contributed and how the investments performed. You choose how to invest this money from a selected list of funds.`,
        bullets: [
          'Group plans leverage institutional pricing, giving you access to very low investment management fees.',
          'Defined Benefit (DB) plans offer a guaranteed retirement paycheck.',
          'Defined Contribution (DC) plans rely on contributions and investment performance.'
        ]
      },
      {
        id: 'mod-2-les-2',
        title: 'The Magic of Employer Matching',
        content: `In most Defined Contribution (DC) plans or Group RRSPs, employers offer a **Matching Program**. This is the closest thing to "free money" you will ever find in the financial world.

**How it works:**
If your employer has a "5% match" policy:
* If you contribute **5%** of your salary into the group plan, your employer will contribute an **additional 5%** of their own money.
* That is an **instant 100% return on your investment** before your funds even touch the market!
* If you contribute 0%, your employer contributes 0%. You are literally leaving free salary on the table.

**Vesting:** Some employer pension plans require a short period of employment (usually up to 2 years) before the employer's contributions fully belong to you. This is called the "Vesting Period".`,
        bullets: [
          'Employer matching is an automatic, risk-free 100% return on your money.',
          'Failing to participate in a matching plan is equivalent to turning down a 3% to 5% salary raise.',
          'Understand your plan\'s vesting rules to ensure you keep 100% of your employer\'s matches if you change jobs.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q2-1',
        question: 'If your employer offers a dollar-for-dollar match up to 4% of your salary, and you contribute 2%, how much will your employer contribute?',
        options: [
          '4%, because they always max out their contributions.',
          '0%, because you didn\'t reach the 4% threshold to qualify.',
          '2%, because they match your contribution dollar-for-dollar.',
          '8%, because of compounding rates.'
        ],
        correctAnswerIndex: 2,
        explanation: 'They match you dollar-for-dollar *up to* a limit of 4%. Since you contributed 2%, they match you with 2%. To get the maximum "free money", you should increase your contribution to 4%!'
      },
      {
        id: 'q2-2',
        question: 'What is a Defined Benefit (DB) pension plan?',
        options: [
          'A plan where you define exactly how much you want to invest each month.',
          'A plan that guarantees a specific, pre-calculated retirement income for life, usually based on salary and years of service.',
          'A plan that is only available to self-employed freelancers.',
          'An account where you can withdraw money tax-free for any purchase.'
        ],
        correctAnswerIndex: 1,
        explanation: 'Defined Benefit (DB) plans provide a guaranteed retirement pension income based on a specific formula, with the investment risk falling entirely on the employer rather than the employee.'
      },
      {
        id: 'q2-3',
        question: 'What does the term "Vesting" refer to in employer group pension plans?',
        options: [
          'The uniform you have to wear to financial planning meetings.',
          'The process of selecting which mutual funds to buy.',
          'The period of time you must work for an employer before their matched contributions legally belong to you.',
          'The annual tax slip sent to the CRA detailing your capital gains.'
        ],
        correctAnswerIndex: 2,
        explanation: 'Vesting is the process by which employer-matched funds become legally yours. If you leave a company before vesting occurs, you might have to return the employer\'s portion of the contributions.'
      }
    ]
  },
  {
    id: 'mod-3',
    title: '3. Deep Dive: TFSA Rules & Limits',
    shortDescription: 'Master the contribution room calculations, qualified investments, and how to avoid CRA penalties.',
    category: 'tfsa',
    xpReward: 200,
    badgeId: 'badge-tfsa',
    lessons: [
      {
        id: 'mod-3-les-1',
        title: 'Calculating Your True TFSA Room',
        content: `Your TFSA contribution room is **cumulative**. It accumulates every single year you are 18 or older and a resident of Canada, regardless of whether you opened an account.

**How your room grows:**
1. **Annual Limit:** Each year, a flat amount is added to your room (e.g., $7,000 for 2024, 2025, and 2026).
2. **Unused Room:** Any unused contribution room from previous years rolls over indefinitely.
3. **Withdrawal Restorations:** Any withdrawals made in the previous year are added back to your room.

**The Golden Formula:**
*Current Year Room = (Unused Room from Past Years) + (New Annual Limit) + (Previous Year Withdrawals)*

*Note:* You do not get room for years before you turned 18 or before you became a Canadian resident.`,
        bullets: [
          'Your TFSA room accumulates starting the year you turn 18 and are a Canadian resident.',
          'You can find your official, exact TFSA room on the CRA "My Account" portal (be aware that it only updates once a year).',
          'Unused room rolls over forever—there is no "use it or lose it" rule.'
        ]
      },
      {
        id: 'mod-3-les-2',
        title: 'The Dangerous Over-Contribution Trap',
        content: `Because TFSA room restored from withdrawals isn't added back until **the next calendar year**, many Canadians accidentally over-contribute and get hit with heavy CRA penalties.

**The Over-Contribution Penalty:**
If you go over your limit, the CRA charges a **1% monthly tax** on the excess amount for every month it remains in the account. 

**Example of the Trap:**
* You have a maxed-out TFSA.
* In June, you withdraw $5,000 to buy a motorcycle, but then change your mind.
* In July, you put that $5,000 *back* into your TFSA, thinking it is fine.
* **RESULT:** You have over-contributed by $5,000! You cannot put that money back until January 1st of the next year. You will be fined $50 a month (1% of $5,000) until the excess is withdrawn or the new year starts.`,
        bullets: [
          'CRA levies a severe 1% monthly penalty tax on all excess TFSA contributions.',
          'Never re-contribute a withdrawn amount in the same calendar year if you are already at your lifetime limit.',
          'If you over-contribute, withdraw the excess immediately to stop the monthly penalty accrual.'
        ]
      },
      {
        id: 'mod-3-les-3',
        title: 'What Can You Hold in a TFSA?',
        content: `A massive misconception is that a TFSA is just a regular "savings account" yielding a tiny amount of interest. In reality, a TFSA is an investment shell.

You can hold a wide range of financial assets inside a TFSA:
* **Exchange-Traded Funds (ETFs) & Mutual Funds**
* **Individual Stocks** (Canadian and US exchanges)
* **GICs (Guaranteed Investment Certificates)**
* **Bonds & High-Interest Cash**

By investing in compounding assets like broad-market stock index ETFs inside your TFSA, all your capital gains, interest, and dividends grow 100% tax-free over decades, which is infinitely more powerful than earning 1% interest on cash!`,
        bullets: [
          'A TFSA can hold stocks, bonds, GICs, ETFs, and mutual funds.',
          'Using a TFSA merely for cash savings misses the true wealth-building potential of tax-free compounding.',
          'Note: Day-trading (frequent buying/selling of stocks as a business) is prohibited inside a TFSA and can trigger CRA audits.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q3-1',
        question: 'What is the penalty for exceeding your TFSA contribution limit?',
        options: [
          'A one-time warning letter with no financial penalty.',
          'An automatic seizure of the entire TFSA by the CRA.',
          'A tax of 1% per month on the excess contribution amount.',
          'Your bank accounts are frozen for 90 days.'
        ],
        correctAnswerIndex: 2,
        explanation: 'The CRA penalizes TFSA over-contributions by charging a tax of 1% per month on the highest excess amount, calculated for every month that the excess remains in your account.'
      },
      {
        id: 'q3-2',
        question: 'Which of the following CANNOT be held inside a Canadian TFSA?',
        options: [
          'Stocks traded on major international stock exchanges.',
          'Guaranteed Investment Certificates (GICs).',
          'Broad-market index ETFs (Exchange-Traded Funds).',
          'Physical real estate properties (like your residential house).'
        ],
        correctAnswerIndex: 3,
        explanation: 'While TFSAs can hold a wide variety of paper investments (stocks, ETFs, GICs, mutual funds, bonds), they cannot be used to directly hold physical real estate properties or physical collectibles.'
      },
      {
        id: 'q3-3',
        question: 'If you were born in 1990, lived in Canada your whole life, and have never contributed to a TFSA, how much room do you have?',
        options: [
          'Just the current year\'s limit (e.g. $7,000).',
          'The total accumulated limit of all annual limits since the program began in 2009.',
          'Exactly $100,000, which is the flat lifetime limit for everyone.',
          'Unlimited room, because room is based entirely on your annual salary.'
        ],
        correctAnswerIndex: 1,
        explanation: 'Because you turned 18 before 2009 and have been a Canadian resident since, your unused room rolls over year after year. Your room is the sum of every annual TFSA limit since 2009 (which is around $95,000+ as of 2024/2025)!'
      }
    ]
  },
  {
    id: 'mod-4',
    title: '4. Deep Dive: RRSP Rules & Tax Refunds',
    shortDescription: 'Uncover the mechanics of tax brackets, deduction roll-overs, and home buyer/learning program withdrawals.',
    category: 'rrsp',
    xpReward: 200,
    badgeId: 'badge-rrsp',
    lessons: [
      {
        id: 'mod-4-les-1',
        title: 'Determining Your RRSP Contribution Limit',
        content: `Unlike the TFSA which has a flat limit for everyone, your RRSP contribution limit is directly tied to your personal **earned income**.

**The 18% Rule:**
Every year, you earn new RRSP contribution room equal to **18% of your earned income** from the previous tax year, up to a maximum annual dollar cap set by the government (which increases with inflation, e.g., $31,560 for 2024, $32,490 for 2025).

**Pension Adjustment:**
If you participate in an employer group pension plan, your employer\'s contributions will generate a "Pension Adjustment" (PA) on your T4 tax slip, which slightly reduces your RRSP room for the following year to keep things fair.

Just like the TFSA, any unused RRSP room accumulates and rolls over to future years indefinitely!`,
        bullets: [
          'Your RRSP room grows by 18% of your previous year\'s earned income, up to an annual government cap.',
          'Your exact RRSP limit is listed on your most recent CRA Notice of Assessment (NoA).',
          'Employer pensions reduce your next-year RRSP room via a "Pension Adjustment" (PA).'
        ]
      },
      {
        id: 'mod-4-les-2',
        title: 'The Math of the RRSP Tax Refund',
        content: `An RRSP contribution is made with pre-tax dollars. Because most people contribute after-tax money from their paycheck, the CRA returns the "overpaid" tax to you as a refund in the spring.

**Why this matters:**
Your savings are multiplied by your marginal tax rate.
* If you make **$90,000** a year in Ontario, your marginal tax rate is roughly **30%**.
* If you contribute **$10,000** into your RRSP, you will receive an estimated tax refund of **$3,000** ($10,000 × 30%)!
* The net cost to your pocket is only $7,000, but you have a full $10,000 growing tax-sheltered in your retirement account.

*Pro-Tip:* To supercharge your wealth, always reinvest your tax refund back into your RRSP or TFSA rather than spending it on a vacation!`,
        bullets: [
          'RRSPs are highly effective for high-income earners in high tax brackets.',
          'The tax refund is not "free money"—it is a deferred tax bill that must be paid when you withdraw the money in retirement.',
          'Reinvesting your refund leverages compound interest to pay that future tax bill and keep the profit.'
        ]
      },
      {
        id: 'mod-4-les-3',
        title: 'Accessing RRSP Funds Tax-Free',
        content: `Generally, withdrawing money from an RRSP before retirement triggers a permanent loss of contribution room and immediate withholding taxes (up to 30%). 

However, the Canadian government offers two exceptions that let you borrow from your RRSP tax-free:

1. **Home Buyers\' Plan (HBP):** You can withdraw up to **$60,000** from your RRSP to buy or build your first home. You have 15 years to repay the amount back into your RRSP, starting the second year after withdrawal.
2. **Lifelong Learning Plan (LLP):** You can withdraw up to **$20,000** ($10,000 max per year) to pay for full-time training or education for yourself or your spouse. You have 10 years to repay it.

If you fail to make a scheduled annual repayment for either plan, that year's installment is added to your taxable income and taxed at your regular rate.`,
        bullets: [
          'Withdrawing from an RRSP early normally incurs withholding taxes and permanent loss of contribution room.',
          'The Home Buyers\' Plan (HBP) allows up to $60,000 of tax-free borrowing for your first home purchase.',
          'Strict repayment schedules must be met to avoid having the borrowed amounts added to your annual taxable income.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q4-1',
        question: 'How is your annual RRSP contribution room calculated?',
        options: [
          'It is a flat $7,000 for everyone in Canada.',
          'It is 18% of your previous year\'s earned income, up to an annual maximum dollar limit, plus unused room.',
          'It is based on your credit score multiplied by 10.',
          'It is 50% of your total household net asset value.'
        ],
        correctAnswerIndex: 1,
        explanation: 'Your RRSP room is calculated as 18% of your earned income from the previous tax year, up to the maximum annual limit set by the CRA, plus any carry-forward unused room.'
      },
      {
        id: 'q4-2',
        question: 'Under the Canadian Home Buyers\' Plan (HBP), what is the maximum amount a first-time home buyer can withdraw tax-free from their RRSP?',
        options: [
          'Exactly $10,000.',
          'Up to $35,000.',
          'Up to $60,000.',
          'Unlimited, as long as it is spent on the downpayment.'
        ],
        correctAnswerIndex: 2,
        explanation: 'The Home Buyers\' Plan limit was increased to $60,000 (up from $35,000) to assist first-time home buyers in navigating the Canadian housing market using their retirement savings.'
      },
      {
        id: 'q4-3',
        question: 'What happens if you fail to repay a scheduled annual installment of your Home Buyers\' Plan withdrawal?',
        options: [
          'You are arrested by the CRA.',
          'That year\'s unpaid repayment amount is added to your taxable income and taxed as regular income.',
          'Your house is automatically foreclosed.',
          'Your bank accounts are charged a flat $1,000 fine.'
        ],
        correctAnswerIndex: 1,
        explanation: 'If you fail to pay a scheduled HBP installment back into your RRSP, that specific annual repayment amount is permanently treated as taxable income for that year and you pay tax on it.'
      }
    ]
  },
  {
    id: 'mod-5',
    title: '5. The Power of Compounding & Wealth Strategy',
    shortDescription: 'Discover the exponential impact of compound interest and how to strategically allocate your savings.',
    category: 'compounding',
    xpReward: 250,
    badgeId: 'badge-compounding',
    lessons: [
      {
        id: 'mod-5-les-1',
        title: 'Compound Interest: The 8th Wonder of the World',
        content: `Compound interest is the process where your investment earns interest, and then that earned interest earns *more* interest. Over time, this loop generates exponential growth.

**The Math of Time:**
Imagine two friends, **Saver Sam** and **Late Larry**:
* **Sam** starts investing **$300 a month** at age 25. He stops at age 35, contributing a total of **$36,000**. He lets the money sit and grow at a 7% average annual rate.
* **Larry** starts investing **$300 a month** at age 35 and continues all the way until age 65 (30 full years), contributing a total of **$108,000**.
* **Who has more at age 65?**
* **RESULT:** Sam has **$301,000** while Larry has only **$294,000**! Even though Sam invested for only 10 years and contributed 3 times LESS money, his extra 10 years of compounding carried him past Larry. 

This proves that **when** you start saving is infinitely more important than **how much** you save.`,
        bullets: [
          'Compound interest is exponential, meaning its growth accelerates over time.',
          'Starting to save early is much more effective than saving larger amounts later in life.',
          'Reinvesting dividends and interest is the key to unlocking true compounding.'
        ]
      },
      {
        id: 'mod-5-les-2',
        title: 'Strategic Wealth Allocation: Where Do I Put My Next Dollar?',
        content: `Now that you understand Group Pensions, TFSAs, and RRSPs, how do you build a coherent wealth strategy? 

Here is the professional financial planning **Waterfall Method**:

1. **Step 1: The Group Matching Limit (Priority #1):** If your employer offers a match, contribute exactly enough to get the **maximum match**. This is an instant, risk-free 100% return. Never miss this!
2. **Step 2: TFSA vs. RRSP Split (Priority #2):**
   * **If your income is low-to-moderate (under $60k):** Max out your **TFSA** first. Your current tax rate is low, so the RRSP deduction is less valuable. Save the RRSP room for future years when you earn more.
   * **If your income is high (over $90k):** Prioritize your **RRSP** to get massive current-year tax deductions at your high marginal rate. Reinvest the refund!
3. **Step 3: Unmatched Savings (Priority #3):** Once tax shelters are maxed out, invest in standard taxable investment accounts.`,
        bullets: [
          'Priority #1 is ALWAYS maximizing your employer\'s group pension matching.',
          'Priority #2 is TFSA if you are in a lower tax bracket, or RRSP if you are in a high tax bracket.',
          'Never leave matching money on the table; it is an instant raise.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q5-1',
        question: 'Under the financial "Waterfall Method", what should be your absolute first savings priority?',
        options: [
          'Buying high-risk cryptocurrency.',
          'Maxing out your TFSA limit.',
          'Contributing enough to your group pension to secure the maximum employer match.',
          'Paying off low-interest long-term debt.'
        ],
        correctAnswerIndex: 2,
        explanation: 'Employer group matching offers a risk-free, immediate 100% return on your money. No other investment in the world can guarantee that, making it your absolute top financial priority.'
      },
      {
        id: 'q5-2',
        question: 'If you earn $45,000 a year, why is it generally recommended to prioritize your TFSA over your RRSP?',
        options: [
          'Because RRSPs are illegal for salaries under $50,000.',
          'Because your current tax bracket is low, making the RRSP tax deduction less valuable now. You can save RRSP room for higher-earning years.',
          'Because TFSAs offer 10 times higher interest rates than RRSPs.',
          'Because TFSAs are sponsored by the government and RRSPs are not.'
        ],
        correctAnswerIndex: 1,
        explanation: 'When your income is low-to-moderate, your current tax rate is low, meaning an RRSP tax deduction gives you minimal savings. Prioritizing TFSA lets your investments grow tax-free, and you carry forward your RRSP room to years when you will earn more and pay higher tax rates.'
      },
      {
        id: 'q5-3',
        question: 'What is the primary factor that drives the dramatic compounding differences between Saver Sam and Late Larry?',
        options: [
          'Sam chose much riskier stocks than Larry.',
          'Sam had a wealthy family supporting him.',
          'Time. Sam started 10 years earlier, giving his money an extra decade to compound exponentially.',
          'Larry paid higher annual banking fees.'
        ],
        correctAnswerIndex: 2,
        explanation: 'Time is the multiplier in compound interest. Starting early allows the compounding loop of interest-earning-interest to run for longer, which outperforms even massive principal contributions made later in life.'
      }
    ]
  }
];

export const DAILY_CHALLENGE = {
  question: 'Which of these is NOT a tax-advantaged account in Canada?',
  options: [
    'TFSA (Tax-Free Savings Account)',
    'RRSP (Registered Retirement Savings Plan)',
    'FHSA (First Home Savings Account)',
    'HISA (High Interest Savings Account)'
  ],
  correctAnswerIndex: 3,
  explanation: 'A High Interest Savings Account (HISA) is a standard bank savings account where any interest earned is fully taxable, unlike TFSAs, RRSPs, and FHSAs which protect growth from taxes.'
};

export const LEADERBOARD = [
  { rank: 1, name: 'Sébastien L. (Montreal)', xp: 2150, current: false },
  { rank: 2, name: 'Arjun P. (Vancouver)', xp: 1980, current: false },
  { rank: 3, name: 'Sarah M. (Calgary)', xp: 1840, current: false },
  { rank: 4, name: 'You (Saver Scout)', xp: 120, current: true },
  { rank: 5, name: 'Elena K. (Toronto)', xp: 950, current: false },
  { rank: 6, name: 'Marcus T. (Halifax)', xp: 720, current: false },
];
