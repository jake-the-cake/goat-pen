interface PageContainerProps {
  Left: React.FunctionComponent,
  Right: React.FunctionComponent
}
export function PageContainer({ Left, Right }: PageContainerProps): JSX.Element {
  return (
    <main className="main__container">
      <section className="section__left">
        <Left />
      </section>
      <section className="section__right">
        <Right />
      </section>
    </main>
  )
}