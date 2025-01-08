import { OptionFilterError } from "~/errors";

type OptionFilterParams = {
  target: string | HTMLElement;
  placeholder?: string;
};

class OptionFilter {
  private selectEl: HTMLSelectElement = null!;
  private inputEl: HTMLInputElement = null!;
  private optionEl: HTMLOptionElement = null!;
  private initialValue: string = "";
  private placeholder: string = "Search options...";

  /**
   * @param {Object} params - OptionFilterのパラメータ。
   * @param {string | HTMLElement} params.target - 対象のselect要素またはそのセレクタ。
   * @param {string} [params.placeholder] - input要素のプレースホルダー。
   */
  constructor({ target, placeholder }: OptionFilterParams) {
    this.selectEl = this.getSelectElement(target);
    this.initialValue = this.selectEl.value;
    if (placeholder) this.placeholder = placeholder;
  }

  /**
   * OptionFilterを初期化し、input要素を作成して挿入し、
   * オプションをフィルタリングするためのイベントリスナーを設定します。
   */
  public init() {
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
  private getSelectElement(target: string | HTMLElement): HTMLSelectElement {
    let select: HTMLElement | null = null;

    // targetの値がstringかHTMLElementかで処理を分岐
    if (target instanceof HTMLSelectElement) {
      select = target;
    } else if (typeof target === "string") {
      select = document.querySelector(target);
    }

    // select要素が取得できなかった場合、エラーをスロー
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
  private createElements(
    selectEl: HTMLSelectElement
  ): [HTMLInputElement, HTMLOptionElement] {
    // input要素を作成
    const inputEl = document.createElement("input");
    inputEl.style.width = `${selectEl.clientWidth}px`;
    inputEl.style.height = `${selectEl.clientHeight}px`;
    inputEl.style.fontSize = "0.8em";
    inputEl.setAttribute("placeholder", this.placeholder);

    // option要素を作成
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
  private addElements() {
    this.selectEl.insertAdjacentElement("beforebegin", this.inputEl);
    this.selectEl.insertAdjacentElement("afterbegin", this.optionEl);
  }

  /**
   * input要素にイベントリスナーを追加します。
   */
  private addEventListeners() {
    this.inputEl.addEventListener("input", () =>
      this.inputEventCallback(this.inputEl, this.selectEl)
    );
  }

  /**
   * inputイベントのコールバック関数。入力値に基づいてselectオプションをフィルタリングします。
   * @param {HTMLInputElement} inputEl - input要素。
   * @param {HTMLSelectElement} selectEl - select要素。
   */
  private inputEventCallback(
    inputEl: HTMLInputElement,
    selectEl: HTMLSelectElement
  ) {
    // 各種変数の初期化
    const searchTerm = inputEl.value;
    const isEmptySearchTerm = searchTerm === "";
    const options = Array.from(selectEl.options).filter(
      (option) => !option.hasAttribute("filter:ignore")
    );

    // cssのdisplayプロパティでoption要素を表示・非表示を切り替える
    options.forEach((option) => {
      const match = option.text.includes(searchTerm);
      option.style.display = match || isEmptySearchTerm ? "" : "none";
      option.selected = match && !isEmptySearchTerm;
    });

    // 検索文字が空の場合、初期値を選択する
    if (isEmptySearchTerm) {
      const initialOption = options.find(
        (option) => option.value === this.initialValue
      );
      if (initialOption) initialOption.selected = true;
    }
  }
}

export { OptionFilter };
