namespace MatchesComparator
{
	public class Utakmica
	{
		private int id;
		private string domacin;
		private string gost;
		private double nulaDvaKvota;
		private double triPlusKvota;

		public Utakmica(string domacin, string gost, double nulaDvaKvota, double triPlusKvota)
		{
			this.domacin = domacin;
			this.gost = gost;
			this.nulaDvaKvota = nulaDvaKvota;
			this.triPlusKvota = triPlusKvota;
		}

		public int Id
		{
			get
			{
				return id;
			}
			set
			{
				id = value;
			}
		}

		public string Domacin
		{
			get
			{
				return domacin;
			}
		}

		public string Gost
		{
			get
			{
				return gost;
			}
		}

		public double NulaDvaKvota
		{
			get
			{
				return nulaDvaKvota;
			}
		}

		public double TriPlusKvota
		{
			get
			{
				return triPlusKvota;
			}
		}
	}
}