const code = {
    0: `package com.termux.terminal;
import java.util.Arrays;
public final class TerminalBuffer {
TerminalRow[] mLines;
int mTotalRows;
int mScreenRows, mColumns;
private int mActiveTranscriptRows = 0;
private int mScreenFirstRow = 0;
public TerminalBuffer(int columns, int totalRows, int screenRows) {
mColumns = columns;
mTotalRows = totalRows;
mScreenRows = screenRows;
mLines = new TerminalRow[totalRows];
blockSet(0, 0, columns, screenRows, ' ', TextStyle.NORMAL);
}
public String getTranscriptText() {
return getSelectedText(0, -getActiveTranscriptRows(), mColumns, mScreenRows).trim();
}
public String getTranscriptTextWithoutJoinedLines() {
return getSelectedText(0, -getActiveTranscriptRows(), mColumns, mScreenRows, false).trim();
}
public String getTranscriptTextWithFullLinesJoined() {
return getSelectedText(0, -getActiveTranscriptRows(), mColumns, mScreenRows, true, true).trim();
}
public String getSelectedText(int selX1, int selY1, int selX2, int selY2) {
return getSelectedText(selX1, selY1, selX2, selY2, true);
}
public String getSelectedText(int selX1, int selY1, int selX2, int selY2, boolean joinBackLines) {
return getSelectedText(selX1, selY1, selX2, selY2, joinBackLines, false);
}
public String getSelectedText(int selX1, int selY1, int selX2, int selY2, boolean joinBackLines, boolean joinFullLines) {
final StringBuilder builder = new StringBuilder();
final int columns = mColumns;
if (selY1 < -getActiveTranscriptRows()) selY1 = -getActiveTranscriptRows();
if (selY2 >= mScreenRows) selY2 = mScreenRows - 1;
for (int row = selY1; row <= selY2; row++) {
int x1 = (row == selY1) ? selX1 : 0;
int x2;
if (row == selY2) {
x2 = selX2 + 1;
if (x2 > columns) x2 = columns;
} else {
x2 = columns;
}
TerminalRow lineObject = mLines[externalToInternalRow(row)];
int x1Index = lineObject.findStartOfColumn(x1);
int x2Index = (x2 < mColumns) ? lineObject.findStartOfColumn(x2) : lineObject.getSpaceUsed();
if (x2Index == x1Index) {
// Selected the start of a wide character.
x2Index = lineObject.findStartOfColumn(x2 + 1);
}
char[] line = lineObject.mText;
int lastPrintingCharIndex = -1;
int i;
boolean rowLineWrap = getLineWrap(row);
if (rowLineWrap && x2 == columns) {
// If the line was wrapped, we shouldn't lose trailing space:
lastPrintingCharIndex = x2Index - 1;
} else {
for (i = x1Index; i < x2Index; ++i) {
char c = line[i];
if (c != ' ') lastPrintingCharIndex = i;
}
 }`,

    1: `public final class TextStyle {
public final static int CHARACTER_ATTRIBUTE_BOLD = 1;
public final static int CHARACTER_ATTRIBUTE_ITALIC = 1 << 1;
public final static int CHARACTER_ATTRIBUTE_UNDERLINE = 1 << 2;
public final static int CHARACTER_ATTRIBUTE_BLINK = 1 << 3;
public final static int CHARACTER_ATTRIBUTE_INVERSE = 1 << 4;
public final static int CHARACTER_ATTRIBUTE_INVISIBLE = 1 << 5;
public final static int CHARACTER_ATTRIBUTE_STRIKETHROUGH = 1 << 6;
public final static int CHARACTER_ATTRIBUTE_PROTECTED = 1 << 7;
/** Dim colors. Also known as faint or half intensity. */
public final static int CHARACTER_ATTRIBUTE_DIM = 1 << 8;
/** If true (24-bit) color is used for the cell for foreground. */
private final static int CHARACTER_ATTRIBUTE_TRUECOLOR_FOREGROUND = 1 << 9;
/** If true (24-bit) color is used for the cell for foreground. */
private final static int CHARACTER_ATTRIBUTE_TRUECOLOR_BACKGROUND= 1 << 10;
public final static int COLOR_INDEX_FOREGROUND = 256;
public final static int COLOR_INDEX_BACKGROUND = 257;
public final static int COLOR_INDEX_CURSOR = 258;
 /** The 256 standard color entries and the three special (foreground, background and cursor) ones. */
public final static int NUM_INDEXED_COLORS = 259;
final static long NORMAL = encode(COLOR_INDEX_FOREGROUND, COLOR_INDEX_BACKGROUND, 0);
static long encode(int foreColor, int backColor, int effect) {
long result = effect & 0b111111111;
if ((0xff000000 & foreColor) == 0xff000000) {
// 24-bit color.
result |= CHARACTER_ATTRIBUTE_TRUECOLOR_FOREGROUND | ((foreColor & 0x00ffffffL) << 40L);
} else {
// Indexed color.
result |= (foreColor & 0b111111111L) << 40;
}
if ((0xff000000 & backColor) == 0xff000000) {
// 24-bit color.
result |= CHARACTER_ATTRIBUTE_TRUECOLOR_BACKGROUND | ((backColor & 0x00ffffffL) << 16L);
} else {
// Indexed color.
result |= (backColor & 0b111111111L) << 16L;
}
return result;
}
public static int decodeForeColor(long style) {
if ((style & CHARACTER_ATTRIBUTE_TRUECOLOR_FOREGROUND) == 0) {
return (int) ((style >>> 40) & 0b111111111L);
} else {
return 0xff000000 | (int) ((style >>> 40) & 0x00ffffffL);
}
}
public static int decodeBackColor(long style) {
if ((style & CHARACTER_ATTRIBUTE_TRUECOLOR_BACKGROUND) == 0) {
return (int) ((style >>> 16) & 0b111111111L);
} else {
return 0xff000000 | (int) ((style >>> 16) & 0x00ffffffL);
}
}
public static int decodeEffect(long style) {
return (int) (style & 0b11111111111);
}
}`,

    2: ` final class ByteQueue {
private final byte[] mBuffer;
private int mHead;
private int mStoredBytes;
private boolean mOpen = true;
public ByteQueue(int size) {
mBuffer = new byte[size];
}
public synchronized void close() {
mOpen = false;
notify();
}
public synchronized int read(byte[] buffer, boolean block) {
while (mStoredBytes == 0 && mOpen) {
if (block) {
try {
wait();
} catch (InterruptedException e) {
// Ignore.
}
} else {
return 0;
}
}
if (!mOpen) return -1;
int totalRead = 0;
int bufferLength = mBuffer.length;
boolean wasFull = bufferLength == mStoredBytes;
int length = buffer.length;
int offset = 0;
while (length > 0 && mStoredBytes > 0) {
int oneRun = Math.min(bufferLength - mHead, mStoredBytes);
int bytesToCopy = Math.min(length, oneRun);
System.arraycopy(mBuffer, mHead, buffer, offset, bytesToCopy);
mHead += bytesToCopy;
if (mHead >= bufferLength) mHead = 0;
mStoredBytes -= bytesToCopy;
length -= bytesToCopy;
offset += bytesToCopy;
totalRead += bytesToCopy;
}
if (wasFull) notify();
return totalRead;
}
public boolean write(byte[] buffer, int offset, int lengthToWrite) {
if (lengthToWrite + offset > buffer.length) {
throw new IllegalArgumentException("length + offset > buffer.length");
} else if (lengthToWrite <= 0) {
throw new IllegalArgumentException("length <= 0");
}
final int bufferLength = mBuffer.length;
synchronized (this) {
while (lengthToWrite > 0) {
while (bufferLength == mStoredBytes && mOpen) {
try {
wait();
} catch (InterruptedException 
}
}
if (!mOpen) return false;
final boolean wasEmpty = mStoredBytes == 0;
int bytesToWriteBeforeWaiting = Math.min(lengthToWrite, bufferLength - mStoredBytes);
lengthToWrite -= bytesToWriteBeforeWaiting;
while (bytesToWriteBeforeWaiting > 0) {
int tail = mHead + mStoredBytesint
int oneRun;
if (tail >= bufferLength) {
tail = tail - bufferLength;
oneRun = mHead - tail;
} else {
oneRun = bufferLength - tail;
}
int bytesToCopy = Math.min(oneRun, bytesToWriteBeforeWaiting);
System.arraycopy(buffer, offset, mBuffer, tail, bytesToCopy);
offset += bytesToCopy;
bytesToWriteBeforeWaiting -= bytesToCopy;
mStoredBytes += bytesToCopy;
}
if (wasEmpty) notify();
}
}
return true;
}
}`,

};
function random(number) {
    return Math.trunc(Math.random() * number);
}

const randomNumber = random(2);
const randomCodeC = code[randomNumber];

export { randomCodeC };
