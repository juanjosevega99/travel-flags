import { useState, useEffect } from "react";

const url = `https://restcountries.com/v2/all`;

export function Countries() {
  const fetchCountries = async () => {
    const response = await fetch(url)
    const data = await response.json()
  }
}