export const Header = () => {
  return (
    <div>
      <header>
        <h1>Country Explorer</h1>
      </header>
      <div className='dropdown'>
        <select>
          <option value='latam'>Latam</option>
          <option value='europe'>Europe</option>
          <option value='asia'>Asia</option>
        </select>
      </div>
    </div>
  );
};
