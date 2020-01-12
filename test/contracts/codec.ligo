
type ops is list(operation)
type sample_record is record
  attributeA: string;
  attributeB: nat;
end
type property_record is record
  predicate_address: address;
  inputs: list(bytes);
end
type sample_tuple is (address * list(bytes))


////////////////
// PACK contract for test purpose
////////////////
function pack_address (const action: address; const s: bytes) : (ops * bytes) is
begin skip end with ((nil:ops), bytes_pack(action))

function pack_bignumber (const action: string; const s: bytes) : (ops * bytes) is
begin skip end with ((nil:ops), bytes_pack(action))

function pack_sample_record (const pack_params: sample_record; const s: bytes) : ( ops * bytes ) is
begin skip end with ( (nil:ops) , bytes_pack(pack_params) )

function pack_property_record (const action: property_record; const s: bytes) : (ops * bytes) is
begin skip end with ((nil:ops), bytes_pack(action))

function pack_tuple (const action: sample_tuple; const s: bytes) : (ops * bytes) is
begin skip end with ((nil:ops), bytes_pack(action))



////////////////
// UNPACK contract for test purpose
////////////////
function unpack_sample_record (const unpack_params: bytes; const s: option(sample_record)) : ( ops * option(sample_record) ) is
begin skip end with ( (nil:ops) , ( bytes_unpack( unpack_params ) : option(sample_record) ) )

function unpack_property_record (const action: bytes; const s: option(property_record)) : (ops * option(property_record)) is
begin skip end with ((nil:ops), ( bytes_unpack(action) : option(property_record ) ) )

function unpack_tuple (const action: bytes; const s: option(sample_tuple)) : (ops * option(sample_tuple)) is
begin skip end with ( (nil:ops), ( bytes_unpack(action) : option(sample_tuple) ) )