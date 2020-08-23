module.exports = {
    MoveNotFoundError: class MoveNotFoundError extends Error {
        constructor(characterName, message) {
            super(message);
            this.characterName = characterName;
            this.name = "MoveNotFoundError";
        }
    },

    FrameAdvantageNotFoundError: class FrameAdvantageNotFoundError extends Error {
        constructor(characterName, characterMove, message) {
            super(message);
            this.characterName = characterName;
            this.characterMove = characterMove;
            this.name = "FrameAdvantageNotFoundError";
        }
    },
} 