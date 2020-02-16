const peg = require('pegjs')

/**
 * AST of ligo https://gitlab.com/ligolang/ligo
 */
const ast = `// LIGO Grammar
// ==========================
//
// Accepts output of ligo dry-run

LIGO
 = "(" _ Ops _ ", " _ p:(Item) _  ")" _ {
  return p
}

Ops = "list[" _ Op _ ("," _ Op)* _ "]" / EmptyArray
Op = "Operation(...bytes)"

Primitive
  = _ [0-9a-zA-Z_=@-]+ { return text() }

Struct
  = "record[" _ attr:Attribute _ attrs:("," _ Attribute _)* _ "]" { let obj = {};[attr].concat(attrs.map((a)=>a[2])).forEach((a) => obj[a[0]] = a[1]);return obj; }

Array
  = EmptyArray / "list[" _ primitive:Item _ primitives:("," _ Item _)* _ "]" { return [primitive].concat(primitives.map((a)=>a[2])) }

EmptyArray = "list[" _ "]" { return [] }

Map
  = EmptyMap / "map[" _ attr:MapAttribute _ attrs:("," _ MapAttribute _)* _ "]" { let obj = {};[attr].concat(attrs.map((a)=>a[2])).forEach((a) => obj[a[0]] = a[1]);return obj; }

EmptyMap = "map[" _ "]" { return {} }

Tuple
  = "(" _ primitive:Item _ primitives:("," _ Item _)* _ ")" {
  return [primitive].concat(primitives.map((a)=>a[2]))
  }

Attribute
  = attr:Key _ "->" _ p:(Item) { return [attr, p] }

MapAttribute
  = attr:Key _ "->" _ p:(Item) { return [attr, p] }

Enum
  = attr:String "(" _ item: Item _ ")" { return [attr, item] }

Item
 = Struct / Map / Array / Tuple / Bytes / Number / Address / String2 / Enum / Primitive / EmptyString

Key = Bytes / Number / Address / String2 / String

Integer "integer"
  = _ ("-")?[0-9]+ { return parseInt(text(), 10); }

Number "number"
  = _ "+"[0-9]+ { return parseInt(text(), 10); }

String "string"
  = _ [a-zA-Z0-9_]+ { return text(); }

String2 "string2"
  = _ "\\""str:String"\\"" { return str; }

EmptyString
  = _ '""' { return "" }

Bytes
  = _ "0x"[0-9a-f]+ { return text(); }

  Address "address"
  = _ "@\\""str:String"\\"" { return str; }

_ "whitespace"
  = [ \\t\\n\\r]*
`

module.exports = function(src) {
  const parser = peg.generate(ast)
  return parser.parse(src)
}
