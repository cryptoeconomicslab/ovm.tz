type payload is record
  k: key;
  s: signature;
  b: bytes;
end
function main(const p: payload; const storage: bool ) : (list(operation) * bool) is
begin skip end with ( (nil:list(operation)) , (crypto_check(p.k, p.s, p.b)) )