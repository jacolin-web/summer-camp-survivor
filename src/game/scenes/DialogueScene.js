import Phaser from 'phaser';

export class DialogueScene extends Phaser.Scene {
    constructor() {
        super('DialogueScene');
    }

    init(data) {
        this.dialogueLines = data.lines || [];
        this.onComplete = data.onComplete || (() => {});
    }

    create() {
        const boxHeight = 100;

        // 1. Background
        this.dialogBg = this.add.graphics();
        this.dialogBg.fillStyle(0x000000, 0.7);
        this.dialogBg.fillRoundedRect(50, this.scale.height - boxHeight - 30, this.scale.width - 100, boxHeight, 20);

        // 2. Text
        this.dialogText = this.add.text(70, this.scale.height - boxHeight - 10, '', {
            fontSize: '20px',
            color: '#ffffff',
            wordWrap: { width: this.scale.width - 140 }
        });

        // 3. Input
        this.currentLineIndex = 0;
        this.input.on('pointerdown', this.showNextLine, this);

        // 4. Show first line
        this.showNextLine();
    }

    showNextLine() {
        if (this.currentLineIndex < this.dialogueLines.length) {
            this.dialogText.setText(this.dialogueLines[this.currentLineIndex]);
            this.currentLineIndex++;
        } else {
            this.scene.stop();           // Close the dialogue scene
            this.onComplete();           // Trigger callback if needed
        }
    }
}
