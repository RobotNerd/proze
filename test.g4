grammar test;

/* Parser rules */

title_tag : TITLE markup_value ;
markup_value: ':' (WHITESPACE | WORD)+ NEWLINE+ ;

/* Lexer rules */

fragment LOWERCASE  : [a-z] ;
fragment UPPERCASE  : [A-Z] ;

TITLE : 'Title' ;

//MARKUP_VALUE : ':' (WHITESPACE | WORD)+ NEWLINE+ ;

WORD : (LOWERCASE | UPPERCASE | '_' | '-' | '.' | ';' )+ ;

WHITESPACE : (' ' | '\t') ;

NEWLINE : ('\r'? '\n' | '\r') ;
