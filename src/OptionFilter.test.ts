import { beforeEach, describe, expect, test, vi } from "vitest";
import { OptionFilter } from "~/OptionFilter";

describe("OptionFilterの動作テスト", () => {
  let optionFilter: OptionFilter;
  let selectEl: HTMLSelectElement;

  // confirmのモック
  const confirmSpy = vi.spyOn(window, "confirm");
  confirmSpy.mockReturnValue(true);

  // alertのモック
  const alertSpy = vi.spyOn(window, "alert");
  alertSpy.mockImplementation(() => vi.fn());

  beforeEach(() => {
    document.body.innerHTML = `
      <section class="container mx-auto">
        <select data-label="filter">
          <option>佐々木 一郎</option>
          <option>木下 次郎</option>
          <option>岡田 次郎</option>
        </select>
      </section>
        `;

    // テスト対象の要素を取得
    selectEl = document.querySelector(
      "[data-label=filter]"
    ) as HTMLSelectElement;

    // テスト対象のクラスを初期化
    optionFilter = new OptionFilter({
      target: selectEl,
      placeholder: "プレースホルダー",
    });
  });

  test("初期化時にエラーが発生しない", () => {
    expect(() => optionFilter.init()).not.toThrow();
  });

  test("初期レンダリング時に、inputElが存在する", () => {
    optionFilter.init();
    const inputEl = selectEl.previousElementSibling;

    expect(inputEl).not.toBeNull();
  });

  test("初期化後にplaceholder属性値が存在する", () => {
    optionFilter.init();
    const inputEl = selectEl.previousElementSibling as HTMLInputElement;

    expect(inputEl).toHaveProperty("placeholder");
  });

  test("option[filter:ignore]はselectEl要素の1番目に追加されている", () => {
    optionFilter.init();
    const noticeOption = selectEl.querySelector("option[filter:ignore]");

    expect(noticeOption).toBe(selectEl.firstElementChild);
  });

  test("option[filter:ignore]は常にdisplay:noneになっている", () => {
    optionFilter.init();
    const noticeOption = selectEl.querySelector("option[filter:ignore]");
    const inputEl = selectEl.previousElementSibling as HTMLInputElement;

    inputEl.value = "佐々木 一郎";
    inputEl.dispatchEvent(new Event("input"));
    expect(noticeOption && getComputedStyle(noticeOption).display).toBe("none");

    inputEl.value = "";
    inputEl.dispatchEvent(new Event("input"));
    expect(noticeOption && getComputedStyle(noticeOption).display).toBe("none");
  });

  test("option[filter:ignore]のvalueはnullになっている", () => {
    optionFilter.init();
    const noticeOption = selectEl.querySelector("option[filter:ignore]");

    expect(noticeOption).toHaveProperty("value", "");
  });

  test("input要素にテキストを入力すると、入力値に一致しないoptionにdisplay:noneが付与されている", () => {
    optionFilter.init();
    const inputEl = selectEl.previousElementSibling as HTMLInputElement;

    inputEl.value = "佐々木 一郎";
    inputEl.dispatchEvent(new Event("input"));

    const options = Array.from(selectEl.options).filter(
      (option) => !option.hasAttribute("filter:ignore")
    );
    const displayNoneOptions = options.filter(
      (option) => option.style.display === "none"
    );

    expect(displayNoneOptions).toHaveLength(2);
  });

  test("input要素に複数マッチする場合、マッチするoptionが正しく表示されるようになっている", () => {
    optionFilter.init();
    const inputEl = selectEl.previousElementSibling as HTMLInputElement;

    inputEl.value = "次郎";
    inputEl.dispatchEvent(new Event("input"));

    const options = Array.from(selectEl.options).filter(
      (option) => !option.hasAttribute("filter:ignore")
    );
    const displayNoneOptions = options.filter(
      (option) => option.style.display === "none"
    );

    expect(displayNoneOptions).toHaveLength(1);
  });
});
