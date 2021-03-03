import React, { FC } from 'react'

interface Props {
  title: string;
}

const HelloWorld: FC<Props> = ({ title }) => (
  <div>{`Hello ${title}`}</div>
)

export default HelloWorld