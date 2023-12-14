import Map from "@/components/maps/map";

export default function Home() {
  return (
    <>
      <section className="section">
        <div className="row">
            <div className="col-md-8 col-12">
                <div className="card">
                    <div className="card-header">
                        <div className="row align-items-center">
                            <div className="col-md-auto">
                                <h5 className="card-title">Google Maps with Location</h5>
                            </div>
                           
                        </div>
                    </div>
                     <Map/>
                     <br />
                     {/* <MapTrialError/> */}
                </div>
            </div>
        </div>
      </section>
    </>
  )
}