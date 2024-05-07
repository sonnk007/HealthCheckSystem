interface ParentCompProps {
  childComp?: React.ReactNode;
}

const DoctorPage: React.FC<ParentCompProps> = (props: any) => {
  const { childComp } = props;
  return <div>{childComp}</div>;
};

export default DoctorPage;
