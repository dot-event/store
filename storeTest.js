/* eslint-env jest */

var dot = require("dot-event")(),
  store = require("./store")

beforeEach(function() {
  dot.reset()
  store(dot)
})

test("get", function() {
  dot.state.store = { a: { b: true } }
  expect(dot("get", "a", "b")).toBe(true)
  expect(dot.get("a", "b")).toBe(true)
})

test("delete", function() {
  return dot
    .set("a.b.c", true)
    .then(function() {
      return dot.delete("a.b")
    })
    .then(function() {
      expect(dot.state.store).toEqual({ a: {} })
    })
})

test("merge", function() {
  return dot("merge.a", { b: { c: true } }).then(
    function() {
      expect(dot("get", "a.b.c")).toBe(true)
    }
  )
})

test("queue", function() {
  return dot("set.a.b.c", "hello")
    .then(function() {
      return dot.set("a.b.c", function() {
        return dot.get("a.b.c") + " world"
      })
    })
    .then(function() {
      expect(dot.get("a.b.c")).toBe("hello world")
    })
})

test("set", function() {
  return dot.set("a.b.c", true).then(function() {
    expect(dot.get("a.b.c")).toBe(true)
  })
})

test("store", function() {
  expect.assertions(2)

  dot.on("store.a.b.c", function(arg, opts) {
    expect(arg).toBe(true)
    expect(opts).toEqual({
      dot: dot,
      ns: "store",
      prop: "a.b.c",
      propArr: ["a", "b", "c"],
    })
  })

  return dot.set("a.b.c", true)
})
