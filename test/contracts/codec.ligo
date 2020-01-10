type sample_record is record
  predicate_address: address;
  inputs: list(bytes);
end
type sample_tuple is (address * list(bytes))

type ops is list(operation)

function pack_record (const action: sample_record; const s: bytes) : (ops * bytes) is
  block {skip} with ((nil:ops), bytes_pack(action))

function pack_tuple (const action: sample_tuple; const s: bytes) : (ops * bytes) is
  block {skip} with ((nil:ops), bytes_pack(action))

function unpack_record (const action: bytes; const s: option(sample_record)) : (ops * option(sample_record)) is
  block {
    const sample_record: option(sample_record) = bytes_unpack(action);
  } with ((nil:ops), sample_record)

function unpack_tuple (const action: bytes; const s: option(sample_tuple)) : (ops * option(sample_tuple)) is
  block {
    const sample_tuple: option(sample_tuple) = bytes_unpack(action);
  } with ((nil:ops), sample_tuple)
