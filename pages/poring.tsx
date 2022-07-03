import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axios, { AxiosResponse } from 'axios';
import { setInterval } from 'timers/promises';
interface IPoring {
  id: number;
  health: number;
  sprite: string;
  facing: string;
  width: number;
  height: number;
  positionX: number;
  positionY: number;
}

function Poring() {
  const screenRef = useRef(null);
  const router = useRouter();
  const [porings, setPorings] = useState<IPoring[]>([]);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const axios = require('axios');

  useEffect(() => {
    if (router.asPath !== router.route) {
      setHeight(50);
      setWidth(50);
      const items: IPoring[] = [];
      for (let i = 0; i < parseInt(`${router.query.units}`); i++) {
        const item = poringData();
        items.push(item);
        moveMent(item.id);
        respawn(item.id);
        // const item = get();
        // items.push(item);
        // moveMent(item.id);
        // respawn(item.id);
      }
      setPorings(items);
    }
    // setInterval(() => {
    //   // get()
    // }, 1000);
  }, [router, screenRef]);

  const getScreenWidth = () => {
    return screenRef.current ? screenRef.current.offsetWidth : 0;
  };

  const getScreenHeight = () => {
    return screenRef.current ? screenRef.current.offsetHeight : 0;
  };

  const get = () => {
    const result: AxiosResponse<IPoring> = axios.get(
      'https://jsonplaceholder.typicode.com/todos/1',
    );
    return result;
  };

  // const put = () => {
  //   return null;
  // };

  const poringData = () => {
    const curFacing = randomFacing();
    const item: IPoring = {
      id: random(99999999, 1000000000),
      facing: curFacing,
      health: 5,
      sprite: '/poring.gif',
      width: 50,
      height: 50,
      positionX: moveMentX(curFacing),
      positionY: moveMentY(),
    };
    return item;
  };

  const random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  const randomFacing = (): string => {
    const facings = ['left', 'right'];
    const facing = facings[Math.floor(Math.random() * facings.length)];
    return facing;
  };

  const moveMent = (id: number) => {
    setPorings((current) =>
      current.map((obj) => {
        if (obj.id === id) {
          const facing = randomFacing();
          return {
            ...obj,
            facing: facing,
            positionX: moveMentX(facing, obj.positionX),
            positionY: moveMentY(obj.positionY),
          };
        }
        return obj;
      }),
    );
    const nextExecutionTime = random(6000, 12000);
    setTimeout(() => {
      moveMent(id);
    }, nextExecutionTime);
  };

  const attack = (id: number): void => {
    setPorings((currents) =>
      currents.map((current) => {
        if (current.id === id) {
          return {
            ...current,
            health: current.health - 1,
          };
        }
        return current;
      }),
    );
  };

  const respawn = (id: number): void => {
    setPorings((currents) =>
      currents.map((current) => {
        if (current.id === id && current.health === 0) {
          const fullHealth = 5;
          return {
            ...current,
            health: fullHealth,
          };
        }
        return current;
      }),
    );
    console.log('used');
    const nextExecutionTime = random(6000, 12000);
    setTimeout(() => {
      respawn(id);
    }, nextExecutionTime);
  };

  // const isDead = () => [];

  const moveMentX = (facing: string, position?: number): number => {
    const maxPosition = getScreenWidth();
    const minPosition = (15 * maxPosition) / 100;
    const movPosition = random(0, 200);

    if (!position) position = random(minPosition, maxPosition);
    if (facing === 'left') position -= movPosition;
    else position += movPosition;

    if (position <= minPosition + width) position = minPosition + width;
    if (position >= maxPosition - width) position = maxPosition - width;

    return position;
  };

  const moveMentY = (position?: number): number => {
    const maxPosition = getScreenHeight();
    const minPosition = (60 * maxPosition) / 100;
    const movPosition = random(0, 200);
    const checkTrue = randomFacing();
    if (!position) position = random(minPosition, maxPosition);
    if (checkTrue === 'left') position -= movPosition;
    else position += movPosition;

    if (position <= minPosition + height) position = minPosition + height;
    if (position >= maxPosition - height) position = maxPosition - height;

    return position;
  };

  return (
    <div
      ref={screenRef}
      id="bun"
      className="overflow-hidden"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        backgroundImage: `url('/genshin.jpg')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      {porings.map((poring) => {
        return (
          <div
            key={poring.id}
            style={{
              display: poring.health === 0 ? 'none' : '',
              position: 'absolute',
              width: poring.width,
              height: poring.height,
              transform: `translate(${poring.positionX}px, ${poring.positionY}px)`,
              transition: `transform 6s`,
            }}
          >
            <img
              onClick={() => attack(poring.id)}
              className="absolute"
              src={poring.sprite}
              alt=""
              style={{
                transform: `rotateY(-${poring.facing === 'right' ? 180 : 0}deg)`,
                transition: `transform 0s`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default Poring;
