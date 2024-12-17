if (window.location.href.match(/https:\/\/www\.nssctf\.cn\/problem\/\d+/)) {
  const problemId = window.location.href.split("/").pop();
  const apiUrl = `https://www.nssctf.cn/api/problem/${problemId}/annex/download/`;

  chrome.runtime.sendMessage({ action: "getCookies" }, (response) => {
    const cookieString = response.cookieString;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200 && data.data) {
          const downloadUrl = data.data.replace(/\\/g, "");

          let filename = "attach.zip";
          const filenameMatch = downloadUrl.match(/filename=([^&]+)/);
          if (filenameMatch && filenameMatch[1]) {
            filename = decodeURIComponent(filenameMatch[1]);
          }

          const curlCommand = `curl '${downloadUrl}' \\
-H 'Cookie: ${cookieString}' \\
-H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' \\
-H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \\
-H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8' \\
-H 'Referer: ${window.location.href}' \\
-H 'Origin: https://www.nssctf.cn' \\
--output '${filename}'`;

          const buttons = Array.from(
            document.querySelectorAll("button.el-button")
          );
          const downloadButton = buttons.find((button) =>
            button.textContent.includes("附件下载")
          );

          if (downloadButton) {
            const newButton = downloadButton.cloneNode(true);
            downloadButton.parentNode.replaceChild(newButton, downloadButton);
            const iconAndNumber = newButton.querySelector("span div");
            const span = newButton.querySelector("span");
            if (span) {
              span.textContent = "附件下载(curl) ";
              if (iconAndNumber) {
                span.appendChild(iconAndNumber);
              }
            }
            newButton.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();

              navigator.clipboard
                .writeText(curlCommand)
                .then(() => {
                  const textNode = span.firstChild;
                  textNode.textContent = "已复制! ";
                  setTimeout(
                    () => (textNode.textContent = "附件下载(curl) "),
                    2000
                  );
                })
                .catch((err) => {
                  console.error("复制失败:", err);
                  const textNode = span.firstChild;
                  textNode.textContent = "复制失败 ";
                  setTimeout(
                    () => (textNode.textContent = "附件下载(curl) "),
                    2000
                  );
                });
            });
          }
        }
      })
      .catch((error) => console.error("Error:", error));
  });
}
