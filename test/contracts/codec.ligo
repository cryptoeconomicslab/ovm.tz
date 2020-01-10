
type sample_record is record
  attributeA: string;
  attributeB: nat;
end

type storage is record
  binary: bytes;
  struct: sample_record;
end

type action is
  | PACK of sample_record
  | UNPACK of bytes


type ops is list(operation)
type context is (ops * storage)

function pack_action (const pack_params: sample_record; const s: storage) : context is
begin
  s.binary := bytes_pack(pack_params);
end with ( (nil:ops) , s )

function unpack_action (const unpack_params: bytes; const s: storage) : context is
begin
  const dummy_record : sample_record = record
    attributeA = "";
    attributeB = 0n;
  end;
  const maybe_unpacked_result : option(sample_record) = bytes_unpack( unpack_params );
  const unpacked_result : sample_record = case maybe_unpacked_result of
  | None -> dummy_record
  | Some(unpacked) -> unpacked
  end;
  s.struct := unpacked_result;
end with ( (nil:ops) , s )



function main (const action: action; const s: storage) : context is
  block {skip} with
  case action of
    | PACK(pack_params) -> pack_action(pack_params, s)
    | UNPACK(unpack_params) -> unpack_action(unpack_params, s)
  end
