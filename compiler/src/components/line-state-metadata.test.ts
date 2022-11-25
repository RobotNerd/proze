import { CompilerMessages } from "../util/compiler-messages";
import { testSingleLine } from './line-state-test-helper';

describe('LineState metadata', () => {

    beforeEach(() => {
        CompilerMessages.getInstance().reset();
    });

    test('sanitizes escaped open bracket in author name', () => {
        testSingleLine( 'Author: abc \\[', 'Author: abc [');
    });

    test('sanitizes escaped closed bracket in author name', () => {
        testSingleLine( 'Author: abc \\]', 'Author: abc ]');
    });

    test('sanitizes escaped bold token in author name', () => {
        testSingleLine( 'Author: abc \\__', 'Author: abc __');
    });

    test('sanitizes escaped italics token in author name', () => {
        testSingleLine( 'Author: abc \\*', 'Author: abc *');
    });

    test('sanitizes escaped open bracket in chapter name', () => {
        testSingleLine( 'Chapter: abc \\[', 'Chapter: abc [');
    });

    test('sanitizes escaped closed bracket in chapter name', () => {
        testSingleLine( 'Chapter: abc \\]', 'Chapter: abc ]');
    });

    test('sanitizes escaped bold token in chapter name', () => {
        testSingleLine( 'Chapter: abc \\__', 'Chapter: abc __');
    });

    test('sanitizes escaped italics token in chapter name', () => {
        testSingleLine( 'Chapter: abc \\*', 'Chapter: abc *');
    });

    test('sanitizes escaped open bracket in section name', () => {
        testSingleLine( 'Section: abc \\[', 'Section: abc [');
    });

    test('sanitizes escaped closed bracket in section name', () => {
        testSingleLine( 'Section: abc \\]', 'Section: abc ]');
    });

    test('sanitizes escaped bold token in section name', () => {
        testSingleLine( 'Section: abc \\__', 'Section: abc __');
    });

    test('sanitizes escaped italics token in section name', () => {
        testSingleLine( 'Section: abc \\*', 'Section: abc *');
    });

    test('sanitizes escaped open bracket in title name', () => {
        testSingleLine( 'Title: abc \\[', 'Title: abc [');
    });

    test('sanitizes escaped closed bracket in title name', () => {
        testSingleLine( 'Title: abc \\]', 'Title: abc ]');
    });

    test('sanitizes escaped bold token in title name', () => {
        testSingleLine( 'Title: abc \\__', 'Title: abc __');
    });

    test('sanitizes escaped italics token in title name', () => {
        testSingleLine( 'Title: abc \\*', 'Title: abc *');
    });
});
