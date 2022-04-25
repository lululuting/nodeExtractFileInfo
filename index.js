const fs = require("fs");
const nodeXlsx = require("node-xlsx").default;

const workPtah = "/Users/luting/Desktop/Demo/test"; // 工作文件夹路径
const exportFilePath = "/Users/luting/Desktop"; // 导出文件路径

// 存放结果
const results = [];
// 递归获取
const loopFile = function (url) {
  const files = fs.readdirSync(url);
  for (item of files) {
    // 判断是否为目录
    const fileName = url + "/" + item;
    if (fs.lstatSync(fileName).isDirectory()) {
      loopFile(fileName);
    } else {
      // 只需要.txt文件的内容
      const reg = /^.*\.txt$/;
      if (reg.test(item)) {
        const dataContent = fs.readFileSync(fileName, "utf8");
        results.push({
          folderName: url,
          fileName: item,
          content: dataContent,
        });
      }
    }
  }
};
loopFile(workPtah);

// 整合xlsx数据
let data = [["文件夹名", "文件名", "内容"]];
//再把每一行数据加进去
results.forEach(function (result) {
  const ele = [];
  ele.push(result.folderName);
  ele.push(result.fileName);
  ele.push(result.content);
  data.push(ele);
});
//由于各列数据长度不同，可以设置一下列宽（好像没啥用）
const options = { "!cols": [{ wch: 50 }, { wch: 30 }, { wch: 100 }] };
//生成表格
const buffer = nodeXlsx.build([{ name: "sheet1", data }], options);
fs.writeFileSync(exportFilePath + "/test.xlsx", buffer, { flag: "w" });
