class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }

  //清除
  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
  }

  //刪除
  delete() {
    const NumberCurrentOperand = Number(this.currentOperand);
    // NumberCurrentOperand 為 0 或 NaN 不執行。
    // NaN 和 0 本身是 falsy
    // 所以 if 條件式會把 2 者都看成 false
    if (NumberCurrentOperand) {
      this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }
  }

  //計算機的數字判斷
  appendNum(number) {
    //按小數點，只輸出一次
    if (number === "." && this.currentOperand.includes(".")) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  //計算機的符號判斷
  chooseOperation(operation) {
    if (this.currentOperand !== "" && this.previousOperand !== "") {
      this.compute();
      this.previousOperand = this.currentOperand;
      this.currentOperand = "";
    }

    this.operation = operation;
    if (this.currentOperand === "") return;
    if (this.previousOperand !== "") {
      this.compute();
    }

    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }

  //計算判斷
  //用parseFloat()將字串轉成數字
  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    const digit = this.getDigit(this.operation);

    switch (this.operation) {
      case "+":
        computation = this.formatFloat(prev + current, digit);
        break;
      case "-":
        computation = this.formatFloat(prev - current, digit);
        break;
      case "*":
        computation = this.formatFloat(prev * current, digit);
        break;
      case "÷":
        computation = prev / current;
        break;
      default:
        return;
    }
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = "";
  }

  //解決浮點數問題
  //
  formatFloat(f, digit) {
    let m = Math.pow(10, digit);
    return parseInt(f * m, 10) / m;
  }

  //階層式計算
  //只能是正整數，負數或是0都回傳1
  getfactorial(current) {
    if (isNaN(current)) return;
    if (current <= 1) {
      this.currentOperand = 1;
    }
    this.currentOperand = this.factorial(current);
  }

  //階層式計算公式
  factorial(num) {
    if (num <= 1) return 1;
    return num * this.factorial(num - 1);
  }

  getDigit(operation) {
    // this.previousOperand.includes('.') && this.currentOperand.includes('.') 判斷是否小數計算
    // 是的話 找出小數點後位數最長的length 當作 計算 this.formatFloat 的參數 digit
    // 否的話 this.formatFloat 的參數 digit 傳 1

    const lengthGroup = [
      String(this.previousOperand).length,
      String(this.previousOperand).length,
    ];
    const isFloatCal =
      String(this.previousOperand).includes(".") &&
      String(this.currentOperand).includes(".");
    let digit = 1;

    switch (operation) {
      case "+":
        digit = isFloatCal ? Math.max(...lengthGroup) : 1;
        break;
      case "-":
        digit = isFloatCal ? Math.max(...lengthGroup) : 1;
        break;
      case "*":
        digit = isFloatCal ? [...lengthGroup].reduce((a, b) => a + b, 0) : 1;
        break;
      case "÷":
        digit = isFloatCal
          ? [...lengthGroup].reduce((a, b) => Math.abs(a - b), 0)
          : 1;
        break;
      default:
        return;
    }
    return digit;
  }

  getDisplayNum(number) {
    const stringNum = number.toString();
    const integerDigits = parseFloat(stringNum.split(".")[0]); //整數
    const decimalDigits = stringNum.split(".")[1]; //小數
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0, //使用小數位數的最大數目
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  //計算結果的顯示
  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNum(
      this.currentOperand
    );
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNum(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = "";
    }
  }
}

const numberButtons = document.querySelectorAll("[data_num]");
const operationButtons = document.querySelectorAll("[data_operation]");
const previousOperandTextElement = document.querySelector(
  "[data_previous_operand]"
);
const currentOperandTextElement = document.querySelector(
  "[data_current_operand]"
);
const allClearButton = document.querySelector("[data_all_clear]");
const deleteButton = document.querySelector("[data_delete]");
const equalsButton = document.querySelector("[data_equals]");
const factorialButton = document.querySelector("[data_factorial]");

const calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement
);

//監聽

//click計算機，innerText取得值，並顯示
numberButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    calculator.appendNum(button.innerText);
    calculator.updateDisplay();
    boom(e);
  });
});

//加減乘除-運算符號
operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

//等於
equalsButton.addEventListener("click", () => {
  calculator.compute();
  calculator.updateDisplay();
});

//全部清除
allClearButton.addEventListener("click", () => {
  calculator.clear();
  calculator.updateDisplay();
});

//刪除
deleteButton.addEventListener("click", () => {
  calculator.delete();
  calculator.updateDisplay();
});

//階層式
factorialButton.addEventListener("click", () => {
  calculator.getfactorial(parseFloat(calculator.currentOperand));
  calculator.updateDisplay();
});
