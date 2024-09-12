import getID from '../../src/services/common';

describe('getID', () => {
  it('gets the ID from a Spotify URI', () => {
    expect(getID("Spotify:song:abcdefghijkl")).toBe("abcdefghijkl");
  });
});
