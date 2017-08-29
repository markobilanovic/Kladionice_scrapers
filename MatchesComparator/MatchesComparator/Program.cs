using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace MatchesComparator
{
	class Program
	{
		static void Main(string[] args)
		{
			Console.WriteLine("START!");
			string databaseFolder = "\\csv";
			string[] filenames = Directory.GetFiles(Directory.GetCurrentDirectory() + databaseFolder);

			Processor processor = new Processor();
			processor.ProcessFiles(filenames);
			processor.PrintResults("allResults.csv", "hit.csv");
			Console.WriteLine("FINISHED!");
			Console.ReadKey();
		}
	}
}
