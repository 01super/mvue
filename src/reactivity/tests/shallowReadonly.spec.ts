import { isReadonly, shallowReadonly } from "../reactive";

describe("shallowReadonly", () => {
  test("should not make non-reactive properties reactive", () => {
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = shallowReadonly(original);
    expect(isReadonly(wrapped.foo)).toBe(true);
    expect(isReadonly(original.bar)).toBe(false);
  });
});
