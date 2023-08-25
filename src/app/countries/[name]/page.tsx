interface CountryDetailsProps {
  params: {
    name: string;
  };
}

const CountryDetails: React.FC<CountryDetailsProps>  = ({ params: { name } }) => {
  return <h1>{name}</h1>;
};

export default CountryDetails;
