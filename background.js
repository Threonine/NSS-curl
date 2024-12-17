chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCookies") {
    const requiredCookies = ["token", "sessionid"];

    chrome.cookies.getAll({}, (cookies) => {
      const nssCookies = cookies.filter(
        (cookie) =>
          cookie.domain.includes("nssctf.cn") &&
          requiredCookies.includes(cookie.name)
      );
      const cookieString = nssCookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");
      sendResponse({ cookieString: cookieString });
    });
    return true;
  }
});
