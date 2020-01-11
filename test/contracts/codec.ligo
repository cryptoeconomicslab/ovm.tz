
type ops is list(operation)
type sample_record is record
  attributeA: string;
  attributeB: nat;
end
type sample_tuple is (address * list(bytes))

function pack_sample_record (const pack_params: sample_record; const s: bytes) : ( ops * bytes ) is
begin skip end with ( (nil:ops) , bytes_pack(pack_params) )

function unpack_sample_record (const unpack_params: bytes; const s: option(sample_record)) : ( ops * option(sample_record) ) is
begin skip end with ( (nil:ops) , ( bytes_unpack( unpack_params ) : option(sample_record) ) )

function unpack_tuple (const action: bytes; const s: option(sample_tuple)) : (ops * option(sample_tuple)) is
begin skip end with ( (nil:ops), ( bytes_unpack(action) : option(sample_tuple) ) )