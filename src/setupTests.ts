// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

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
