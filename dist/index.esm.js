// src/errors/index.ts
var OptionFilterError = class extends Error {
  static {
    this.prototype.name = "OptionFilterError";
  }
  constructor(message) {
    const stackLine = (new Error().stack?.split("\n")[2] || "").trim();
    super(`OptionFilterError:
${message}

${stackLine}`);
  }
};

// src/OptionFilter.ts
var OptionFilter = class {
  selectEl = null;
  inputEl = null;
  optionEl = null;
  initialValue = "";
  placeholder = "Search options...";
  /**
   * @param {Object} params - OptionFilterのパラメータ。
   * @param {string | HTMLElement} params.target - 対象のselect要素またはそのセレクタ。
   * @param {string} [params.placeholder] - input要素のプレースホルダー。
   */
  constructor({ target, placeholder }) {
    this.selectEl = this.getSelectElement(target);
    this.initialValue = this.selectEl.value;
    if (placeholder) this.placeholder = placeholder;
  }
  /**
   * OptionFilterを初期化し、input要素を作成して挿入し、
   * オプションをフィルタリングするためのイベントリスナーを設定します。
   */
  init() {
    try {
      const [inputEl, optionEl] = this.createElements(this.selectEl);
      this.inputEl = inputEl;
      this.optionEl = optionEl;
      this.addElements();
      this.addEventListeners();
    } catch (error) {
      console.error(error);
    }
  }
  /**
   * targetからselect要素を取得します。
   * @param {string | HTMLElement} target - 対象のselect要素またはそのセレクタ。
   * @returns {HTMLSelectElement} 取得したselect要素。
   * @throws {OptionFilterError} select要素が見つからない場合にスローされます。
   */
  getSelectElement(target) {
    let select = null;
    if (target instanceof HTMLSelectElement) {
      select = target;
    } else if (typeof target === "string") {
      select = document.querySelector(target);
    }
    if (!select) throw new OptionFilterError("selectElement is null");
    if (!(select instanceof HTMLSelectElement))
      throw new OptionFilterError("selectElement is not HTMLSelectElement");
    return select;
  }
  /**
   * select要素に合わせてスタイル設定されたinput要素を作成します。
   * @param {HTMLSelectElement} selectEl - 合わせるselect要素。
   * @returns {[HTMLInputElement, HTMLOptionElement]} 作成されたinput要素とoption要素。
   */
  createElements(selectEl) {
    const inputEl = document.createElement("input");
    inputEl.style.width = `${selectEl.clientWidth}px`;
    inputEl.style.height = `${selectEl.clientHeight}px`;
    inputEl.style.fontSize = "0.8em";
    inputEl.setAttribute("placeholder", this.placeholder);
    const optionEl = document.createElement("option");
    optionEl.text = "No match";
    optionEl.value = "";
    optionEl.setAttribute("filter:ignore", "true");
    optionEl.style.display = "none";
    return [inputEl, optionEl];
  }
  /**
   * input要素とoption要素をselect要素に追加します。
   */
  addElements() {
    this.selectEl.insertAdjacentElement("beforebegin", this.inputEl);
    this.selectEl.insertAdjacentElement("afterbegin", this.optionEl);
  }
  /**
   * input要素にイベントリスナーを追加します。
   */
  addEventListeners() {
    this.inputEl.addEventListener(
      "input",
      () => this.inputEventCallback(this.inputEl, this.selectEl)
    );
  }
  /**
   * inputイベントのコールバック関数。入力値に基づいてselectオプションをフィルタリングします。
   * @param {HTMLInputElement} inputEl - input要素。
   * @param {HTMLSelectElement} selectEl - select要素。
   */
  inputEventCallback(inputEl, selectEl) {
    const searchTerm = inputEl.value;
    const isEmptySearchTerm = searchTerm === "";
    const options = Array.from(selectEl.options).filter(
      (option) => !option.hasAttribute("filter:ignore")
    );
    options.forEach((option) => {
      const match = option.text.includes(searchTerm);
      option.style.display = match || isEmptySearchTerm ? "" : "none";
      option.selected = match && !isEmptySearchTerm;
    });
    if (isEmptySearchTerm) {
      const initialOption = options.find(
        (option) => option.value === this.initialValue
      );
      if (initialOption) initialOption.selected = true;
    }
  }
};
export {
  OptionFilter
};
