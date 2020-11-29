import { idFromUrl } from './../eero'
describe('eero helpers', () => {
  test('idFromUrl: network url', () => {
    const parsedId = idFromUrl('/2.2/networks/64254')
    expect(parsedId).toBe('64254')
  })

  test('idFromUrl: eeros url', () => {
    const parsedId = idFromUrl('/2.2/eeros/3536439')
    expect(parsedId).toBe('3536439')
  })

  test('idFromUrl: devices url', () => {
    const parsedId = idFromUrl('/2.2/devices/4842')
    expect(parsedId).toBe('4842')
  })

  test('idFromUrl: id', () => {
    const parsedId = idFromUrl('2342')
    expect(parsedId).toBe('2342')
  })

  test('idFromUrl: garbage', () => {
    const parsedGarbage = idFromUrl('2.8/something/1337')
    expect(parsedGarbage).toBeNull()
  })
})
