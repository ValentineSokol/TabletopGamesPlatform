import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styled from 'styled-components';
import {distanceBetweenCells, pieceGraphics } from "./constants/board";

const PieceContainer = styled.div`
    z-index: 2;
    position: absolute;
    bottom: ${props => props.cell.destination.y * distanceBetweenCells}%;
    right:${props => props.cell.destination.x * distanceBetweenCells}%;
    width: 13%;
    height: 13%;
    background: ${props => `url(${pieceGraphics[props.cell.piece]})`};
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
`;
const Piece = (cell) => {
    const pieceRef = useRef(null);
    useEffect(() => {
        // gsap.to(pieceRef.current, { top: '13%', left: '13%' });
    }, []);
    return (
        <>
        <PieceContainer
            cell={cell}
            onClick={cell.select}
            ref={pieceRef}
        />
        </>
    );
}

export default Piece;