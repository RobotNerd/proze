grammar Proze;

/* Parser rules */

document : (title_tag? | author_tag? ) chapter+ ;

title_tag : TITLE markup_value ;
chapter_tag : CHAPTER markup_value ;
author_tag : AUTHOR markup_value ;
section_tag : SECTION  markup_value | SECTION_SYMBOL WHITESPACE* NEWLINE+;
markup_value: ':' (WHITESPACE | WORD)+ NEWLINE+;

chapter: chapter_tag (paragraph | section_tag)+ ;

paragraph : sentence+ NEWLINE NEWLINE+ ;

sentence : ( WORD | WHITESPACE | PUNCTUATION )+ STOP ;

bold : BOLD (WORD+ | WHITESPACE)+ (BOLD | NEWLINE) ;

italic : ITALIC (WORD+ | WHITESPACE)+ (ITALIC | NEWLINE) ;

block_comment : BLOCK_COMMENT (WORD | COMMENT_CALLOUT | WHITESPACE)+ (BLOCK_COMMENT | EOF) ;
line_comment : LINE_COMMENT (WORD | COMMENT_CALLOUT | WHITESPACE)+ NEWLINE ;

/* Lexer rules */

fragment LOWERCASE  : [a-z] ;
fragment UPPERCASE  : [A-Z] ;

// Markup
TITLE : 'Title' ;
CHAPTER : 'Chapter' ;
AUTHOR : 'Author' ;
SECTION : 'Section' ;
SECTION_SYMBOL: '---' ;

BLOCK_COMMENT : '###' ;
LINE_COMMENT : '##' ;

COMMENT_CALLOUT: 'FIXME' | 'IMPORTANT' | 'NOTE' | 'TODO' ;

EM_DASH : '--';

STOP : ( '.' | '!' | '?' ) ;

ITALIC : '*' ;

BOLD : '__' ;

PUNCTUATION : ( '"' | '\'' | ';' | ',' | EM_DASH ) ;

WORD : (LOWERCASE | UPPERCASE | '-' | '.' | ';' )+ ;

WHITESPACE : (' ' | '\t') ;

NEWLINE : ('\r'? '\n' | '\r') ;
