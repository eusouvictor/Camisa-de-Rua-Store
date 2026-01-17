import test from "node:test";
import assert from "node:assert/strict";
import { addItemToCart } from "./cart";

test("addItemToCart adds a new item with quantity 1", () => {
  const cart = [];
  const product = { id: 1, type: "product", name: "Camisa" };

  const result = addItemToCart(cart, product);

  assert.deepEqual(result, [{ ...product, quantity: 1 }]);
});

test("addItemToCart increments quantity when id and type match", () => {
  const cart = [{ id: 1, type: "product", name: "Camisa", quantity: 2 }];
  const product = { id: 1, type: "product", name: "Camisa" };

  const result = addItemToCart(cart, product);

  assert.deepEqual(result, [{ id: 1, type: "product", name: "Camisa", quantity: 3 }]);
});

test("addItemToCart keeps separate entries when id matches but type differs", () => {
  const cart = [{ id: 1, type: "product", name: "Camisa", quantity: 2 }];
  const product = { id: 1, type: "event", name: "Evento" };

  const result = addItemToCart(cart, product);

  assert.deepEqual(result, [
    { id: 1, type: "product", name: "Camisa", quantity: 2 },
    { id: 1, type: "event", name: "Evento", quantity: 1 },
  ]);
});
