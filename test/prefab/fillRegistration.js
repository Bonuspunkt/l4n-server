async function fillRegistration({ page, username, password1, password2 }) {
    await page.focus('input[name="username"');
    if (username) {
        await page.type(username);
    }
    await page.focus('input[name="password1"]');
    if (password1) {
        await page.type(password1);
    }
    await page.focus('input[name="password2"]');
    if (password2) {
        await page.type(password2);
    }
    await page.click('form[action="/register"] button[type="submit"]');
}

module.exports = fillRegistration;
