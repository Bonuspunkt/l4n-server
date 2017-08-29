async function fillLogin({ page, username, password }) {
    await page.focus('input[name="username"]');
    if (username) { await page.type(username); }
    await page.focus('input[name="password"]');
    if (password) { await page.type(password); }
    await page.click('form[action="/auth/local"] button[type="submit"]');
};

module.exports = fillLogin;
