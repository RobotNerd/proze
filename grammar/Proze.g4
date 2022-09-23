grammar Proze;

/* Parser rules */

document : title_tag? author_tag? paragraph+ EOF ;
// document : (title_tag? | author_tag? ) chapter+ ;

title_tag : TITLE metadata ;
author_tag : AUTHOR metadata ;
// chapter_tag : CHAPTER metadata ;

metadata: ':' (WHITESPACE | WORD)+ NEWLINE+ ;

raw_sentence: ( WORD | WHITESPACE | PUNCTUATION )+ STOP ;
spaced_sentence: raw_sentence WHITESPACE+;

paragraph: ( spaced_sentence+ | spaced_sentence+ raw_sentence | raw_sentence ) ( empty_lines | NEWLINE EOF ) ;

// section_tag : SECTION  metadata | SECTION_SYMBOL WHITESPACE* NEWLINE+ ;

empty_lines: NEWLINE NEWLINE+ ;

// chapter: chapter_tag paragraph+ ( chapter_tag | EOF ) ;
// chapter: chapter_tag (paragraph | section_tag)+ ;

// bold : BOLD (WORD+ | WHITESPACE)+ (BOLD | NEWLINE) ;

// italic : ITALIC (WORD+ | WHITESPACE)+ (ITALIC | NEWLINE) ;

// block_comment : BLOCK_COMMENT (WORD | COMMENT_TOKEN | WHITESPACE)+ (BLOCK_COMMENT | EOF) ;
// line_comment : LINE_COMMENT (WORD | COMMENT_TOKEN | WHITESPACE)+ NEWLINE ;




/* Lexer rules */

fragment LOWERCASE  : [a-z] ;
fragment UPPERCASE  : [A-Z] ;

TITLE : 'Title' ;
AUTHOR : 'Author' ;
// CHAPTER : 'Chapter' ;

WORD : (LOWERCASE | UPPERCASE | '-' )+ ;

WHITESPACE : (' ' | '\t') ;

NEWLINE : ('\r'? '\n' | '\r') ;


// fragment LOWERCASE  : [a-z] ;
// fragment UPPERCASE  : [A-Z] ;

// SECTION : 'Section' ;
// SECTION_SYMBOL: '---' ;

// BLOCK_COMMENT : '###' ;
// LINE_COMMENT : '##' ;

// COMMENT_TOKEN: 'FIXME' | 'IMPORTANT' | 'NOTE' | 'TODO' ;

// EM_DASH : '--';

STOP : ( '.' ) ;
// STOP : ( '.' | '!' | '?' ) '"'? ;

// ITALIC : '*' ;

// BOLD : '__' ;

PUNCTUATION : ( ',' ) WHITESPACE ;
// PUNCTUATION : ( '"' | '\'' | ';' | ',' | ':' | EM_DASH ) ;
