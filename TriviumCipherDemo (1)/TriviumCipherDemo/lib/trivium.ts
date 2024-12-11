export function updateTriviumState(state: number[]): { updatedState: number[], keystreamBit: number } {
  const newState = [...state];
  
  const t1 = newState[65] ^ newState[92];
  const t2 = newState[161] ^ newState[176];
  const t3 = newState[242] ^ newState[287];
  
  const keystreamBit = t1 ^ t2 ^ t3;
  
  const newBit1 = t1 ^ (newState[90] & newState[91]) ^ newState[170];
  const newBit2 = t2 ^ (newState[174] & newState[175]) ^ newState[263];
  const newBit3 = t3 ^ (newState[285] & newState[286]) ^ newState[68];
  
  // Shift the registers
  for (let i = 287; i > 0; i--) {
    newState[i] = newState[i - 1];
  }
  
  // Insert new bits
  newState[0] = newBit3;
  newState[93] = newBit1;
  newState[177] = newBit2;
  
  return { updatedState: newState, keystreamBit };
}

export function initializeTrivium(key: string, iv: string): number[] {
  const state = new Array(288).fill(0);
  
  // Convert key and IV from hex to binary
  const keyBits = hexToBinary(key);
  const ivBits = hexToBinary(iv);
  
  // Load the key bits
  for (let i = 0; i < 80; i++) {
    state[i] = keyBits[i];
  }
  
  // Load the IV bits
  for (let i = 0; i < 80; i++) {
    state[i + 93] = ivBits[i];
  }
  
  // Set the last three bits of the state to 1
  state[285] = state[286] = state[287] = 1;
  
  // Perform 4 full cycles (1152 iterations) to mix the state
  for (let i = 0; i < 1152; i++) {
    const { updatedState } = updateTriviumState(state);
    state.splice(0, state.length, ...updatedState);
  }
  
  return state;
}

function hexToBinary(hex: string): number[] {
  return hex.split('').flatMap(char => 
    parseInt(char, 16).toString(2).padStart(4, '0').split('').map(Number)
  );
}

export function encryptTrivium(plaintext: string, key: string, iv: string): string {
  const state = initializeTrivium(key, iv);
  const plaintextBits = textToBinary(plaintext);
  const keystream = generateKeystream(state, plaintextBits.length);
  const ciphertextBits = plaintextBits.map((bit, i) => bit ^ keystream[i]);
  return binaryToHex(ciphertextBits);
}

export function decryptTrivium(ciphertext: string, key: string, iv: string): string {
  const state = initializeTrivium(key, iv);
  const ciphertextBits = hexToBinary(ciphertext);
  const keystream = generateKeystream(state, ciphertextBits.length);
  const plaintextBits = ciphertextBits.map((bit, i) => bit ^ keystream[i]);
  return binaryToText(plaintextBits);
}

function generateKeystream(state: number[], length: number): number[] {
  const keystream = [];
  for (let i = 0; i < length; i++) {
    const { updatedState, keystreamBit } = updateTriviumState(state);
    keystream.push(keystreamBit);
    state = updatedState;
  }
  return keystream;
}

function textToBinary(text: string): number[] {
  return text.split('').flatMap(char => 
    char.charCodeAt(0).toString(2).padStart(8, '0').split('').map(Number)
  );
}

function binaryToText(binary: number[]): string {
  return binary.join('').match(/.{1,8}/g)!.map(byte => 
    String.fromCharCode(parseInt(byte, 2))
  ).join('');
}

function binaryToHex(binary: number[]): string {
  return binary.join('').match(/.{1,4}/g)!.map(nibble => 
    parseInt(nibble, 2).toString(16)
  ).join('');
}

export { hexToBinary, binaryToHex, textToBinary, binaryToText };

