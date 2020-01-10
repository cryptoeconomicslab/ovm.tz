PACKED_DATA_FILE=test/testdata/packed.txt
UNPACKED_DATA_FILE=test/testdata/unpacked.txt

PACKED_BINARY=`ligo interpret -s pascaligo 'bytes_pack(record attributeA = "hoge"; attributeB = 1n end)'`
PACKED_BINARY=${PACKED_BINARY:2:100}

UNPACKED_RECORD=`ligo interpret -s pascaligo 'case ( bytes_unpack( ( "0507070100000004686f67650001" : bytes ) ) : option(record attributeA: string; attributeB: nat; end) ) of | None -> record attributeA = ""; attributeB = 0n end | Some(d) -> d end'`

echo $PACKED_BINARY
echo $UNPACKED_RECORD


cat << EOF > $PACKED_DATA_FILE
$PACKED_BINARY
EOF
cat << EOF > $UNPACKED_DATA_FILE
$UNPACKED_RECORD
EOF

cat $PACKED_DATA_FILE
cat $UNPACKED_DATA_FILE
