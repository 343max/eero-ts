import { Greeter } from './../index';

test('My Greeter', () => {
  expect(Greeter('Marvin')).toBe('Hello Marvin')
})