const {chromium} = require('playwright'); // or firefox or webkit

async function register(username, password, activityUrl) {
    // Launch a new browser instance
    const browser = await chromium.launch({headless: true}); // set headless: true to run without opening a browser window
    const context = await browser.newContext({timeout: 1200000}); // 1200000
    const page = await context.newPage();

    // Navigate to the login page
    await page.goto('https://anc.ca.apm.activecommunities.com/burnaby/home');
    await page.click('text="Sign In"');

    await page.fill('input[type="text"]', username);
    await page.fill('input[type="password"]', password);
    await page.click('[type="submit"]');
    await page.waitForNavigation();
    await page.goto(activityUrl);

    // Wait for the "Enroll Now" button to appear
    await page.waitForSelector('text="Enroll Now"', {timeout: 1200000}); // 20 minutes
    await page.click('text="Enroll Now"');
    // Click the dropdown to open it
    await page.click('.dropdown__button');

    // Wait for the first option to be visible
    await page.waitForSelector('.dropdown__menu [role="option"]');

    // Click the first option in the dropdown
    await page.click('.dropdown__menu [role="option"]');
    await page.click('[data-qa-id="activity-enrollment-feeSummary-addToCartBtn"]')

    // Checkout
    await page.click('[data-qa-id="shopping-cart-orderSummary-checkoutBtn"][type="submit"]')
    console.log('Clicked Submit for checkout')

    // // Check if the element exists
    // const confirmationElement = await page.$('[data-qa-id="confirmation-receiptNumber"]');
    //
    // // If the element exists, print 'Success' to the console
    // if (confirmationElement) {
    //     console.log('Success. Found the confirmation element.');
    // }
}

async function main() {
    console.log("Registering for " + process.env.ACTIVITY_URL + " using usernames " + process.env.USERNAMES)
    usernames = process.env.USERNAMES.split(',');
    passwords = process.env.PASSWORDS.split(',');

    await Promise.all(usernames.map(async (username, index) => {
        await register(username, passwords[index], process.env.ACTIVITY_URL);
    }));
}

main();