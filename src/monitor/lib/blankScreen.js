import tracker from "../utils/tracker";
import onload from "../utils/onload";

// 我这里取了屏幕中间的两条线  具体按业务来找
export function blankScreen() {
  const wrapperElements = ["html", "body", "#container", ".content"];
  let emptyPoints = 0;
  function isWrapper(element) {
    let selector = getSelector(element);
    if (wrapperElements.indexOf(selector) !== -1) {
      emptyPoints++;
    }
  }
  // 刚开始页面内容为空，等页面渲染完成，再去做判断
  onload(function () {
    let xElements, yElements;
    for (let i = 0; i < 9; i++) {
      xElements = document.elementsFromPoint((window.innerWidth * i) / 10, window.innerHeight / 2);
      yElements = document.elementsFromPoint(window.innerWidth / 2, (window.innerHeight * i) / 10);
      isWrapper(xElements[0]);
      isWrapper(yElements[0]);
    }
    // 白屏
    if (emptyPoints >= 18) {
      const centerElements = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2);
      tracker.send({
        kind: "stability",
        type: "blank",
        emptyPoints: emptyPoints + "",
        screen: window.screen.width + "X" + window.screen.height,
        viewPoint: window.innerWidth + "X" + window.innerHeight,
        selector: getSelector(centerElements[0]),
      });
    }
  });
}

function getSelector(element) {
  const { id, className, nodeName } = element;
  if (id) {
    return "#" + id;
  } else if (className) {
    // 过滤空白符 + 拼接
    return (
      "." +
      className
        .split(" ")
        .filter((item) => !!item)
        .join(".")
    );
  } else {
    return nodeName.toLowerCase();
  }
}
