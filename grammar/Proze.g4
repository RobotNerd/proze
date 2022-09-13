grammar Proze;

/* Parser rules */

document : title_tag? ;

title_tag : TITLE metadata ;

metadata: ':' (WHITESPACE | WORD)+ NEWLINE+ ;


// document : (title_tag? | author_tag? ) chapter+ ;

// title_tag : TITLE metadata ;
// chapter_tag : CHAPTER metadata ;
// author_tag : AUTHOR metadata ;
// section_tag : SECTION  metadata | SECTION_SYMBOL WHITESPACE* NEWLINE+ ;
// metadata: ':' (WHITESPACE | WORD)+ NEWLINE+;

// chapter: chapter_tag (paragraph | section_tag)+ ;

// paragraph : sentence+ NEWLINE NEWLINE+ ;

// sentence : ( WORD | WHITESPACE | PUNCTUATION )+ STOP ;

// bold : BOLD (WORD+ | WHITESPACE)+ (BOLD | NEWLINE) ;

// italic : ITALIC (WORD+ | WHITESPACE)+ (ITALIC | NEWLINE) ;

// block_comment : BLOCK_COMMENT (WORD | COMMENT_TOKEN | WHITESPACE)+ (BLOCK_COMMENT | EOF) ;
// line_comment : LINE_COMMENT (WORD | COMMENT_TOKEN | WHITESPACE)+ NEWLINE ;




/* Lexer rules */

fragment LOWERCASE  : [a-z] ;
fragment UPPERCASE  : [A-Z] ;

TITLE : 'Title' ;

WORD : (LOWERCASE | UPPERCASE | '-' | '.' | ';' )+ ;

WHITESPACE : (' ' | '\t') ;

NEWLINE : ('\r'? '\n' | '\r') ;


// fragment LOWERCASE  : [a-z] ;
// fragment UPPERCASE  : [A-Z] ;

// // Markup
// TITLE : 'Title' ;
// CHAPTER : 'Chapter' ;
// AUTHOR : 'Author' ;
// SECTION : 'Section' ;
// SECTION_SYMBOL: '---' ;

// BLOCK_COMMENT : '###' ;
// LINE_COMMENT : '##' ;

// COMMENT_TOKEN: 'FIXME' | 'IMPORTANT' | 'NOTE' | 'TODO' ;

// EM_DASH : '--';

// STOP : ( '.' | '!' | '?' ) ;

// ITALIC : '*' ;

// BOLD : '__' ;

// PUNCTUATION : ( '"' | '\'' | ';' | ',' | EM_DASH ) ;

// WORD : (LOWERCASE | UPPERCASE | '-' | '.' | ';' )+ ;

// WHITESPACE : (' ' | '\t') ;

// NEWLINE : ('\r'? '\n' | '\r') ;
