// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { TextEncoder } from "util";

import crypto from "crypto";

Object.defineProperty(global.self, "crypto", {
  value: Object.setPrototypeOf({ subtle: crypto.webcrypto.subtle }, crypto),
});

global.TextEncoder = TextEncoder;

// Simulate the mediaDevices API since we're not in a real browser
const mediaDevicesMock = {
  enumerateDevices: () => Promise.resolve([]),
  addEventListener: () => Promise.resolve(),
  removeEventListener: () => Promise.resolve(),
  getUserMedia: () => Promise.resolve({ getTracks: () => [] }),
};

Object.defineProperty(global.navigator, "mediaDevices", {
  value: mediaDevicesMock,
});

class Worker {
  url: string;
  onmessage: (msg: string) => void;
  constructor(stringUrl: string) {
    this.url = stringUrl;
    this.onmessage = (msg: string) => {};
  }

  postMessage(msg: string) {
    this.onmessage(msg);
  }
}

// @ts-expect-error
window.Worker = Worker;
