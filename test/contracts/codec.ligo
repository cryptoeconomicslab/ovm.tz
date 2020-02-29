
type ops is list(operation)
type sample_record is record
  attributeA: string;
  attributeB: nat;
end
type sample_tuple is (nat * address * bytes)
type sample_tuple2 is (bytes * nat)
type coder_list_of_int is map(nat, nat)

////////////////
// PACK contract for test purpose
////////////////
function pack_address (const action: address; const s: bytes) : (ops * bytes) is
begin skip end with ((nil:ops), bytes_pack(action))

function pack_bignumber (const action: string; const s: bytes) : (ops * bytes) is
begin skip end with ((nil:ops), bytes_pack(action))

function pack_sample_record (const pack_params: sample_record; const s: bytes) : ( ops * bytes ) is
begin skip end with ( (nil:ops) , bytes_pack(pack_params) )

function pack_sample_tuple (const action: sample_tuple; const s: bytes) : (ops * bytes) is
begin skip end with ((nil:ops), bytes_pack(action))

function pack_tuple (const action: sample_tuple; const s: bytes) : (ops * bytes) is
begin skip end with ((nil:ops), bytes_pack(action))

function pack_list_of_int (const action: coder_list_of_int; const s: bytes) : (ops * bytes) is
begin skip end with ((nil:ops), bytes_pack(action))

function pack_list_of_record (const action: map(nat, sample_record); const s: bytes) : (ops * bytes) is
begin skip end with ((nil:ops), bytes_pack(action))

function pack_list_of_tuple (const action: map(nat, sample_tuple2); const s: bytes) : (ops * bytes) is
begin skip end with ((nil:ops), bytes_pack(action))

function pack_empty_list (const action: map(nat, unit); const s: bytes) : (ops * bytes) is
begin skip end with ((nil:ops), bytes_pack(action))

function pack_list_of_list_of_int (const action: map(nat, map(nat, nat)); const s: bytes) : (ops * bytes) is
begin skip end with ((nil:ops), bytes_pack(action))


////////////////
// UNPACK contract for test purpose
////////////////
function unpack_address (const unpack_params: bytes; const s: option(address)) : ( ops * option(address) ) is
begin skip end with ( (nil:ops) , ( bytes_unpack( unpack_params ) : option(address) ) )

function unpack_bignumber (const unpack_params: bytes; const s: option(string)) : ( ops * option(string) ) is
begin skip end with ( (nil:ops) , ( bytes_unpack( unpack_params ) : option(string) ) )

function unpack_sample_record (const unpack_params: bytes; const s: option(sample_record)) : ( ops * option(sample_record) ) is
begin skip end with ( (nil:ops) , ( bytes_unpack( unpack_params ) : option(sample_record) ) )

function unpack_sample_tuple (const action: bytes; const s: option(sample_tuple)) : (ops * option(sample_tuple)) is
begin skip end with ((nil:ops), ( bytes_unpack(action) : option(sample_tuple ) ) )

function unpack_tuple (const action: bytes; const s: option(sample_tuple)) : (ops * option(sample_tuple)) is
begin skip end with ( (nil:ops), ( bytes_unpack(action) : option(sample_tuple) ) )

function unpack_list_of_integers (const unpack_params: bytes; const s: option(coder_list_of_int)) : ( ops * option(coder_list_of_int) ) is
begin skip end with ( (nil:ops) , ( bytes_unpack( unpack_params ) : option(coder_list_of_int) ) )

function unpack_list_of_records (const unpack_params: bytes; const s: option(map(nat, sample_record))) : ( ops * option(map(nat, sample_record)) ) is
begin skip end with ( (nil:ops) , ( bytes_unpack( unpack_params ) : option(map(nat, sample_record)) ) )

function unpack_list_of_tuples (const unpack_params: bytes; const s: option(map(nat, sample_tuple2))) : ( ops * option(map(nat, sample_tuple2)) ) is
begin skip end with ( (nil:ops) , ( bytes_unpack( unpack_params ) : option(map(nat, sample_tuple2)) ) )
